export type File = {
  id: string;
  name: string;
  url: string;
  size: string;
  parent: string;
  type: "file";
};

export type Folder = {
  id: string;
  name: string;
  type: "folder";
  parent: string | null;
};

export const mockFolders: Folder[] = [
  { id: "root", name: "root", type: "folder", parent: null },
  { id: "1", name: "Documents", type: "folder", parent: "root" },
  { id: "2", name: "Images", type: "folder", parent: "root" },
  { id: "3", name: "Work", type: "folder", parent: "root" },
  { id: "4", name: "Presentations", type: "folder", parent: "3" },
];

export const mockFiles: File[] = [
  {
    id: "1",
    name: "Resume.pdf",
    type: "file",
    url: "/files/resume.pdf",
    parent: "1",
    size: "1.2 MB",
  },
  {
    id: "2",
    name: "Project Proposal.docx",
    type: "file",
    url: "/files/proposal.docx",
    size: "2.5 MB",
    parent: "4",
  },
  {
    id: "3",
    name: "Vacation.jpg",
    type: "file",
    url: "/files/vacation.jpg",
    size: "3.7 MB",
    parent: "2",
  },
  {
    id: "4",
    name: "Profile Picture.png",
    type: "file",
    url: "/files/profile.png",
    size: "1.8 MB",
    parent: "2",
  },
  {
    id: "5",
    name: "Q4 Report.pptx",
    type: "file",
    url: "/files/q4-report.pptx",
    size: "5.2 MB",
    parent: "3",
  },
  {
    id: "6",
    name: "Budget.xlsx",
    type: "file",
    url: "/files/budget.xlsx",
    size: "1.5 MB",
    parent: "1",
  },
];
