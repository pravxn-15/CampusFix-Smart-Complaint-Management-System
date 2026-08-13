import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import ActivityLog from "../models/ActivityLog.js";
import ChatMessage from "../models/ChatMessage.js";
import Feedback from "../models/Feedback.js";
import Counter from "../models/Counter.js";

const PASSWORD = process.env.SEED_PASSWORD || "campus@123";

const CATEGORY_SEED = [
  { name: "Electrical", icon: "zap", avgResolutionHrs: 18 },
  { name: "Plumbing", icon: "droplet", avgResolutionHrs: 24 },
  { name: "Internet", icon: "wifi", avgResolutionHrs: 12 },
  { name: "Cleaning", icon: "wind", avgResolutionHrs: 10 },
  { name: "Hostel", icon: "home", avgResolutionHrs: 30 },
  { name: "Library", icon: "book-open", avgResolutionHrs: 20 },
  { name: "Laboratory", icon: "activity", avgResolutionHrs: 36 },
  { name: "Transport", icon: "truck", avgResolutionHrs: 48 },
  { name: "Security", icon: "shield", avgResolutionHrs: 6 },
  { name: "Water Supply", icon: "cloud-rain", avgResolutionHrs: 16 },
  { name: "Classroom", icon: "book", avgResolutionHrs: 22 },
  { name: "Other", icon: "more-horizontal", avgResolutionHrs: 40 },
];

const STUDENT_SEED = [
  { name: "Aditi Sharma", email: "aditi.sharma@campus.edu", location: "Hostel Block A, Room 204", department: "B.Tech CSE, 3rd Year", avatarColor: "#2563EB" },
  { name: "Rohan Verma", email: "rohan.verma@campus.edu", location: "Hostel Block B, Room 112", department: "B.Sc Physics, 2nd Year", avatarColor: "#7C3AED" },
  { name: "Meera Iyer", email: "meera.iyer@campus.edu", location: "Hostel Block C, Room 305", department: "B.Com Honours, 1st Year", avatarColor: "#DB2777" },
  { name: "Karan Mehta", email: "karan.mehta@campus.edu", location: "Day Scholar", department: "B.Tech ECE, 4th Year", avatarColor: "#0891B2" },
];

const STAFF_SEED = [
  { name: "Suresh Nair", email: "suresh.nair@campus.edu", department: "Facilities & Maintenance", categories: ["Electrical", "Plumbing"] },
  { name: "Priya Das", email: "priya.das@campus.edu", department: "IT Services", categories: ["Internet"] },
  { name: "Ramesh Gupta", email: "ramesh.gupta@campus.edu", department: "Housekeeping", categories: ["Cleaning", "Hostel"] },
  { name: "Anjali Rao", email: "anjali.rao@campus.edu", department: "Security & Transport", categories: ["Security", "Transport"] },
];

async function destroy() {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Complaint.deleteMany(),
    Notification.deleteMany(),
    ActivityLog.deleteMany(),
    ChatMessage.deleteMany(),
    Feedback.deleteMany(),
    Counter.deleteMany(),
  ]);
  console.log("All collections cleared.");
  await mongoose.disconnect();
}

async function seed() {
  await connectDB();

  console.log("Clearing existing data…");
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Complaint.deleteMany(),
    Notification.deleteMany(),
    ActivityLog.deleteMany(),
    ChatMessage.deleteMany(),
    Feedback.deleteMany(),
    Counter.deleteMany(),
  ]);

  console.log("Seeding categories…");
  const categories = await Category.insertMany(CATEGORY_SEED);
  const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  console.log("Seeding students…");
  const students = [];
  for (const s of STUDENT_SEED) {
    students.push(await User.create({ ...s, password: PASSWORD, role: "user" }));
  }

  console.log("Seeding staff…");
  const staff = [];
  for (const s of STAFF_SEED) {
    staff.push(
      await User.create({
        name: s.name,
        email: s.email,
        department: s.department,
        password: PASSWORD,
        role: "staff",
        avatarColor: "#F59E0B",
        specialty: s.categories.map((name) => catByName[name]._id),
        resolvedCount: Math.floor(Math.random() * 40) + 10,
        rating: Math.round((Math.random() * 1 + 4) * 10) / 10,
      })
    );
  }

  console.log("Seeding admin…");
  const admin = await User.create({
    name: "Dr. Vikram Singh",
    email: "vikram.singh@campus.edu",
    department: "Dean of Student Affairs",
    password: PASSWORD,
    role: "admin",
    avatarColor: "#0F172A",
  });

  console.log("Seeding sample complaints…");
  const [aditi, rohan, meera, karan] = students;
  const [suresh, priya, ramesh, anjali] = staff;

  const sampleComplaints = [
    {
      title: "Flickering tube light in Room 204",
      description: "The tube light near the study desk has been flickering for three days and now makes a buzzing sound.",
      category: catByName.Electrical._id,
      priority: "Medium",
      location: "Hostel Block A, Room 204",
      raisedBy: aditi._id,
      assignedTo: suresh._id,
      status: "In Progress",
      timeline: [
        { status: "Pending", note: "Complaint submitted.", actor: aditi._id },
        { status: "Assigned", note: "Assigned to Suresh Nair (Electrical).", actor: admin._id },
        { status: "Accepted", note: "Accepted the request, will visit today.", actor: suresh._id },
        { status: "In Progress", note: "Replaced starter, checking the choke now.", actor: suresh._id },
      ],
    },
    {
      title: "Wi-Fi not working on Library 2nd floor",
      description: "No Wi-Fi signal near the reading section on the 2nd floor since this morning.",
      category: catByName.Internet._id,
      priority: "High",
      location: "Central Library, 2nd Floor",
      raisedBy: karan._id,
      assignedTo: priya._id,
      status: "Assigned",
      timeline: [
        { status: "Pending", note: "Complaint submitted.", actor: karan._id },
        { status: "Assigned", note: "Assigned to Priya Das (IT Services).", actor: admin._id },
      ],
    },
    {
      title: "Leaking tap in common washroom",
      description: "The wash basin tap on the ground floor common washroom has been leaking continuously since last night.",
      category: catByName.Plumbing._id,
      priority: "High",
      location: "Hostel Block B, Ground Floor",
      raisedBy: rohan._id,
      status: "Pending",
      timeline: [{ status: "Pending", note: "Complaint submitted.", actor: rohan._id }],
    },
    {
      title: "Broken projector in Classroom 301",
      description: "Projector doesn't power on. Checked the cable and socket, both fine.",
      category: catByName.Classroom._id,
      priority: "Medium",
      location: "Academic Block, Classroom 301",
      raisedBy: karan._id,
      assignedTo: suresh._id,
      status: "Resolved",
      resolvedAt: new Date(),
      timeline: [
        { status: "Pending", note: "Complaint submitted.", actor: karan._id },
        { status: "Assigned", note: "Assigned to Suresh Nair.", actor: admin._id },
        { status: "In Progress", note: "Bulb replaced, testing display now.", actor: suresh._id },
        { status: "Resolved", note: "Projector tested and working fine.", actor: suresh._id },
      ],
    },
    {
      title: "Chemistry Lab exhaust fan not working",
      description: "Exhaust fan in Lab 2 stopped working — fumes are not clearing properly during practicals.",
      category: catByName.Laboratory._id,
      priority: "Critical",
      location: "Science Block, Chemistry Lab 2",
      raisedBy: rohan._id,
      assignedTo: suresh._id,
      status: "Accepted",
      timeline: [
        { status: "Pending", note: "Complaint submitted.", actor: rohan._id },
        { status: "Assigned", note: "Assigned to Suresh Nair — flagged as safety-critical.", actor: admin._id },
        { status: "Accepted", note: "On my way to inspect the wiring.", actor: suresh._id },
      ],
    },
    {
      title: "Suspicious person near Gate 2 at night",
      description: "Noticed an unfamiliar person loitering near Gate 2 around 11 PM for two nights in a row.",
      category: catByName.Security._id,
      priority: "Critical",
      location: "Gate 2, Perimeter Wall",
      raisedBy: karan._id,
      assignedTo: anjali._id,
      status: "Resolved",
      resolvedAt: new Date(),
      timeline: [
        { status: "Pending", note: "Complaint submitted.", actor: karan._id },
        { status: "Assigned", note: "Escalated immediately to night security.", actor: admin._id },
        { status: "In Progress", note: "Patrol increased around Gate 2, CCTV footage reviewed.", actor: anjali._id },
        { status: "Resolved", note: "Identified as a delivery contractor waiting on a call.", actor: anjali._id },
      ],
    },
    {
      title: "Overflowing dustbin outside mess hall",
      description: "Bin hasn't been emptied in two days, attracting flies.",
      category: catByName.Cleaning._id,
      priority: "Medium",
      location: "Outside Mess Hall",
      raisedBy: aditi._id,
      assignedTo: ramesh._id,
      status: "Resolved",
      resolvedAt: new Date(),
      timeline: [
        { status: "Pending", note: "Complaint submitted.", actor: aditi._id },
        { status: "Assigned", note: "Assigned to Ramesh Gupta.", actor: admin._id },
        { status: "Resolved", note: "Emptied and a second bin added to prevent overflow.", actor: ramesh._id },
      ],
    },
    {
      title: "No water supply in Block C",
      description: "No water in taps since 6 AM, checked all floors.",
      category: catByName["Water Supply"]._id,
      priority: "High",
      location: "Hostel Block C",
      raisedBy: meera._id,
      assignedTo: suresh._id,
      status: "In Progress",
      timeline: [
        { status: "Pending", note: "Complaint submitted.", actor: meera._id },
        { status: "Assigned", note: "Assigned to Suresh Nair.", actor: admin._id },
        { status: "In Progress", note: "Overhead tank motor tripped, resetting and checking the line.", actor: suresh._id },
      ],
    },
  ];

  let complaintCounter = 1023;
  for (const c of sampleComplaints) {
    complaintCounter += 1;
    const complaint = await Complaint.create({
      ...c,
      complaintId: `CMP-${complaintCounter}`,
      estimatedResolutionHrs: 24,
    });

    if (complaint.status === "Resolved") {
      await Feedback.create({
        complaint: complaint._id,
        user: complaint.raisedBy,
        rating: Math.floor(Math.random() * 2) + 4,
        comment: "Thanks, fixed quickly!",
      });
    }
  }
  await Counter.create({ _id: "complaintId", seq: complaintCounter });

  console.log("Seeding activity log…");
  await ActivityLog.create([
    { actor: admin._id, action: `assigned a complaint to ${suresh.name}` },
    { actor: suresh._id, action: "moved a complaint to In Progress" },
    { actor: anjali._id, action: "resolved a complaint" },
  ]);

  console.log("✅ Seed complete.");
  console.log(`   ${students.length} students, ${staff.length} staff, 1 admin, ${sampleComplaints.length} complaints`);
  console.log(`   All accounts use the password: ${PASSWORD}`);

  await mongoose.disconnect();
}

const isDestroy = process.argv.includes("--destroy");
(isDestroy ? destroy() : seed()).catch((err) => {
  console.error(err);
  process.exit(1);
});
