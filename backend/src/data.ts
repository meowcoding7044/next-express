import { User, Product } from "./types";
import { hash } from "./utils";
export const users: User[] = [
  {
    id: "1",
    name: "Alice Admin",
    email: "admin@example.com",
    password: hash("password"),
    roles: ["admin"],
  },
  {
    id: "2",
    name: "Manager Mike",
    email: "manager@example.com",
    password: hash("password"),
    roles: ["manage"],
  },
  {
    id: "3",
    name: "General Gina",
    email: "general@example.com",
    password: hash("password"),
    roles: ["general"],
  },
];
export const products: Product[] = [
  {
    id: "p1",
    name: "Widget",
    count: 10,
    price: 9.99,
    groupType: "gadget",
    status: "active",
  },
  {
    id: "p2",
    name: "Gizmo",
    count: 5,
    price: 19.99,
    groupType: "gadget",
    status: "active",
  },
    {
    id: "p3",
    name: "Asus",
    count: 50,
    price: 19.99,
    groupType: "gadget",
    status: "active",
  },
   {
    id: "p4",
    name: "Acer",
    count: 3,
    price: 10,
    groupType: "gadget",
    status: "active",
  },
   {
    id: "p5",
    name: "Dota",
    count: 50,
    price: 19.99,
    groupType: "gadget",
    status: "active",
  },
   {
    id: "p6",
    name: "Jave",
    count: 50,
    price: 19.99,
    groupType: "gadget",
    status: "active",
  },
   {
    id: "p7",
    name: "Pokemon",
    count: 7,
    price: 60,
    groupType: "gadget",
    status: "active",
  },
];
