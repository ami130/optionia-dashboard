export type TPermission = {
  id: number;
  name: string;
  codename: string;
  status: boolean;
};

type ActionNames = {
  change: string;
  view: string;
  delete: string;
  add: string;
};
export const actionNames: ActionNames = {
  change: "change",
  view: "view",
  delete: "delete",
  add: "add",
};

type ModuleNames = {
  shift: string;
  gradelevel: string;
  student: string;
  classsubject: string;
  routine: string;
  section: string;
  examhall: string;
  exam: string;
  examhallreceipt: string;
  exammark: string;
  gradescale: string;
  studentresult: string;
  admissionsession: string;
  admission: string;
  employeeattendance: string;
  attendance: string;
  teacher: string;
  department: string;
  employee: string;
  payroll: string;
  feestructure: string;
  payment: string;
  fees: string;
  admissionfeestructure: string;
  account: string;
  transaction: string;
  institution: string;
  role: string;
  noticeboard: string;
  rulesandregulations: string;
  smsconfig: string;
};

export const moduleNames: ModuleNames = {
  role: "role",
  rulesandregulations: "rulesandregulations",
  smsconfig: "smsconfig",
  noticeboard: "noticeboard",
  shift: "shift",
  gradelevel: "gradelevel",
  student: "student",
  classsubject: "classsubject",
  section: "section",
  routine: "routine",
  exam: "exam",
  examhall: "examhall",
  examhallreceipt: "examhallreceipt",
  exammark: "exammark",
  gradescale: "gradescale",
  studentresult: "studentresult",
  admissionsession: "admissionsession",
  admission: "admission",
  employeeattendance: "employeeattendance",
  attendance: "attendance",
  teacher: "teacher",
  department: "teacher",
  employee: "teacher",
  payroll: "payroll",
  payment: "payment",
  feestructure: "feestructure",
  fees: "fees",
  admissionfeestructure: "admissionfeestructure",
  account: "account",
  institution: "institution",
  transaction: "transaction",
};
