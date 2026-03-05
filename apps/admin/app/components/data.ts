// All mock/static data used across dashboard components
import { Users, CheckCircle2, Target, Building2, DollarSign } from "lucide-react";
import { BarChart3, Cpu, Zap, Wrench } from "lucide-react";

export const stats = [
  {
    title: "Eligible Students",
    value: "1,248",
    icon: Users,
    iconBg: "#EEF2FF",
    iconColor: "#6366F1",
  },
  {
    title: "Students Placed",
    value: "156",
    icon: CheckCircle2,
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
  },
  {
    title: "Placement Rate",
    value: "71.4%",
    icon: Target,
    iconBg: "#F3E8FF",
    iconColor: "#A855F7",
  },
  {
    title: "Companies Visited",
    value: "87",
    icon: Building2,
    iconBg: "#FEF3C7",
    iconColor: "#F59E0B",
  },
  {
    title: "Average Package",
    value: "₹12.5 LPA",
    icon: DollarSign,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
];

export interface Department {
  name: string;
  placements: number;
  internships: number;
  avgPackage: string;
  highestPackage: string;
  offers: number;
  eligibleStudents: number;
  studentsPlaced: number;
  rate: string;
}

export interface ActivityItem {
  title: string;
  desc: string;
  time: string;
  tag: string;
  color: string;
}

export interface EventItem {
  date: string;
  month: string;
  title: string;
  time: string;
  dept: string;
  tag: string;
  color: string;
}

export const departments = [
  {
    name: "Computer Science",
    placements: 168,
    internships: 95,
    avgPackage: "₹15.2 LPA",
    highestPackage: "₹42 LPA",
    offers: 210,
    eligibleStudents: 420,
    studentsPlaced: 168,
    rate: "40%",
  },
  {
    name: "Electronics",
    placements: 142,
    internships: 78,
    avgPackage: "₹12.8 LPA",
    highestPackage: "₹28 LPA",
    offers: 175,
    eligibleStudents: 380,
    studentsPlaced: 142,
    rate: "37%",
  },
  {
    name: "Electrical",
    placements: 98,
    internships: 52,
    avgPackage: "₹10.5 LPA",
    highestPackage: "₹21 LPA",
    offers: 130,
    eligibleStudents: 280,
    studentsPlaced: 98,
    rate: "35%",
  },
  {
    name: "Mechanical",
    placements: 85,
    internships: 48,
    avgPackage: "₹9.8 LPA",
    highestPackage: "₹18 LPA",
    offers: 115,
    eligibleStudents: 260,
    studentsPlaced: 85,
    rate: "33%",
  },
  {
    name: "Civil",
    placements: 60,
    internships: 35,
    avgPackage: "₹8.5 LPA",
    highestPackage: "₹16 LPA",
    offers: 90,
    eligibleStudents: 200,
    studentsPlaced: 60,
    rate: "30%",
  },

  {
    name: "MCA",
    placements: 72,
    internships: 40,
    avgPackage: "₹11.4 LPA",
    highestPackage: "₹22 LPA",
    offers: 100,
    eligibleStudents: 180,
    studentsPlaced: 72,
    rate: "40%",
  },
  {
    name: "MBA",
    placements: 88,
    internships: 54,
    avgPackage: "₹13.6 LPA",
    highestPackage: "₹25 LPA",
    offers: 140,
    eligibleStudents: 210,
    studentsPlaced: 88,
    rate: "42%",
  },
  {
    name: "MSc",
    placements: 50,
    internships: 30,
    avgPackage: "₹9.2 LPA",
    highestPackage: "₹18 LPA",
    offers: 70,
    eligibleStudents: 150,
    studentsPlaced: 50,
    rate: "33%",
  },
  {
    name: "MTech",
    placements: 66,
    internships: 38,
    avgPackage: "₹14.1 LPA",
    highestPackage: "₹30 LPA",
    offers: 95,
    eligibleStudents: 170,
    studentsPlaced: 66,
    rate: "39%",
  },
];

export const tabs = [
  { key: "overall", label: "Overall", icon: BarChart3 },
  { key: "computerscience", label: "Computer Science", icon: Cpu },
  { key: "electronics", label: "Electronics", icon: Zap },
  { key: "mechanical", label: "Mechanical", icon: Wrench },
  { key: "civil", label: "Civil", icon: Building2 },
  { key: "mca", label: "MCA", icon: Cpu },
  { key: "mba", label: "MBA", icon: Building2 },
  { key: "msc", label: "MSc", icon: Cpu },
  { key: "mtech", label: "MTech", icon: Cpu },
];

export const recentActivity: ActivityItem[] = [
  { title: "New job posted", desc: "Google - Software Engineer (35 LPA)", time: "2 hours ago", tag: "job", color: "#6366f1" },
  { title: "Student placed", desc: "Rahul Kumar selected at Microsoft", time: "4 hours ago", tag: "placement", color: "#22c55e" },
  { title: "New recruiter", desc: "Amazon joined the platform", time: "1 day ago", tag: "recruiter", color: "#f97316" },
  { title: "Application milestone", desc: "1000+ applications submitted", time: "2 days ago", tag: "milestone", color: "#eab308" },
  { title: "Internship offer", desc: "Priya Singh accepted Adobe Internship", time: "3 days ago", tag: "placement", color: "#22c55e" },
];

export const upcomingEvents: EventItem[] = [
  { date: "15", month: "March", title: "Google Campus Drive", time: "10:00 AM", dept: "CSE, ECE", tag: "Drive", color: "#6366f1" },
  { date: "18", month: "March", title: "Resume Building Workshop", time: "2:00 PM", dept: "All", tag: "Workshop", color: "#22c55e" },
  { date: "20", month: "March", title: "Microsoft Interview Day", time: "9:00 AM", dept: "CSE", tag: "Interview", color: "#f97316" },
  { date: "22", month: "March", title: "Amazon Hiring Event", time: "11:00 AM", dept: "CSE, ECE, EEE", tag: "Drive", color: "#6366f1" },
  { date: "25", month: "March", title: "Mock Interview Sessions", time: "3:00 PM", dept: "All", tag: "Workshop", color: "#22c55e" },
];
