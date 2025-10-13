export interface IProducts {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  enrollment_date: Date;
  grade_levels: any[];
  is_active: boolean;
  user: IUserProduct;
}

export interface ICreateProduct {
  first_name: string;
  last_name: string;
  mother_name: string;
  father_name: string;
  mother_email: string;
  father_email: string;
  mother_profession: string;
  mother_designation: string;
  mother_education_qualification: string;
  father_profession: string;
  father_designation: string;
  father_education_qualification: string;
  mother_phone_number: string;
  phone_number: string;
  father_number: string;
  date_of_birth: string; // Same as above
  local_guardian_name: string;
  local_guardian_email: string;
  local_guardian_phone_number: string;
  local_guardian_relation: string;
  gender: "Male" | "Female" | "Other"; // You can adjust this based on your app
  religion: string;
  nationality: string;
  present_address: string;
  permanent_address: string;
  is_active: boolean;
  email: string;
  image: string; // URL or base64 string for the image
}

export interface IUserProduct {
  id: number;
  username: string;
  role: IRole;
  date_joined: Date;
  last_login: Date;
  is_active: boolean;
}

export interface IRole {
  id: number;
  name: string;
  institution: IInstitution;
}

export interface IInstitution {
  id: number;
  name: string;
  code: string;
  city: string;
  contact_email: string;
  is_active: boolean;
}
