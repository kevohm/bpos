import { IoIosStar } from "react-icons/io";
import { IoShieldHalfSharp } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import {
  facebook,
  twitter,
  linkedin,
  instagram,
  bar,
  law,
  property,
  supermarket,
  hospital,
  pharmacy,
} from "../assets";
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
//   FaLinkedin,
// } from "react-icons/fa6";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "feature",
    title: "Features",
  },
  {
    id: "products",
    title: "Products",
  },
  {
    id: "pricing",
    title: "Pricing",
  },
  {
    id: "support",
    title: "Support",
  },
];
export const heroInfo = [
  {
    id: 1,
    title: "Dynamic Bar Management",
    img: bar,
    content:
      "From inventory tracking to crafting signature cocktails, we empower vibrant, profitable bars.",
    button: "Get Started",
  },
  {
    id: 2,
    title: "Smart Supermarket Solutions",
    img: supermarket,
    content:
      "Transform your supermarket management with our cutting-edge technology. Manage inventory efficiently, analyze sales trends, and enhance customer satisfaction through personalized shopping experiences.",
    button: "Get Started",
  },
  {
    id: 3,
    title: "Efficient Law Practice Management",
    img: law,
    content:
      "Revolutionize your law firm operations with our tailored management solution. From case management to document handling, our application ensures seamless workflow and client satisfaction.",
    button: "Get Started",
  },
  {
    id: 4,
    title: "Integrated Property Management",
    content:
      "Optimize your property management tasks with our all-in-one solution. From tenant management to financial tracking, our application ensures smooth operations and increased property value.",
    img: property,
    button: "Get Started",
  },
  {
    id: 5,
    title: "Innovative Pharmacy Management",
    content:
      "Optimize your pharmacy operations with our advanced management system. From medication tracking to customer management, our solution ensures accuracy, compliance, and excellent patient care.",
    img: pharmacy,
    button: "Get Started",
  },
  {
    id: 6,
    title: "Next-Gen Hospital Management",
    content:
      "Empower your healthcare institution with our comprehensive management application. Streamline patient records, optimize scheduling, and enhance overall efficiency to provide top-notch medical care.",
    img: hospital,
    button: "Get Started",
  },
];
export const features = [
  {
    id: "feature-1",
    icon: IoIosStar,
    title: "Credibility",
    content:
      "The best credible loan merchants offering some tantalizing loans to common mwananchi",
  },
  {
    id: "feature-2",
    icon: IoShieldHalfSharp,
    title: "100% Secured",
    content:
      "We take proactive steps make sure your information and loans payments are secure.",
  },
  {
    id: "feature-3",
    icon: IoIosSend,
    title: "Easy Processing",
    content:
      "We take proactive steps make sure your information and loans payments are secure.",
  },
];

export const products = [
  {
    id: "product-1",
    content:
      "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
    name: "Employee Guarante Loan",
    img: "https://media.istockphoto.com/id/1145371340/photo/partner-has-made-a-fraud-in-the-contract-of-sale-and-being-handed-a-cash-and-pen-to-the.jpg?s=612x612&w=0&k=20&c=gEL2GiGxVAWIg6zd73afHWjVE37cNEBww49DE45jwiI=",
    eligible: "Primarily targeted for employed and salaried individuals",
    amount: "Maximum disbursement of Kshs.100,000",
    interest: [
      " Loans below Kshs.10,000,flat interest rate of Kshs.2000",
      "Loans above Kshs.10,000. 16% interest rate on the principal plus an administration fee",
    ],
  },
  {
    id: "product-2",
    content:
      "This loan is specifically designed for SMEs.In this case, the loan will be secured by the business stock,which include inventory,raw materials, or finished goods.",
    name: "SMEs Loan",
    img: "https://tonziradio.com/wp-content/uploads/2024/02/logbook-loan.jpg",
    eligible: "Primarily targeted for SMEs",
    amount: "Maximum disbursement of Kshs.100,000",
    interest: [" This loan has an interest rate of 16% per month", ""],
  },
  {
    id: "product-3",
    content:
      "This loan helps individuals with financial emergencies.It has a maturity period of 1 to 2 days.",
    name: "Short-term loans",
    img: "https://media.istockphoto.com/id/1434470550/photo/signing-a-house-sale-agreement.jpg?s=612x612&w=0&k=20&c=6G_M1FP6AKSr6rpmhAlqjnXdAnvKXr9s_GN6F-JjFxw=",
    eligible: "Primarily targeted for individuals with abrupt emergency",
    amount: "Maximum disbursement of Kshs.100,000",
    interest: [" This loan has an interest rate of 10% daily", ""],
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
    name: "Kelvin Kibet",
    img: "",
  },
  {
    id: "feedback-2",
    content:
      "Money makes your life easier. If you're lucky to have it, you're lucky.",
    name: "Rosemary Akinyi",
    img: "",
  },
  {
    id: "feedback-3",
    content:
      "It is usually people in the money business, finance, and international trade that are really rich.",
    name: "Onesmus Maina",
    title: "Founder & Leader",
    img: "",
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "Active Users",
    value: 3800,
  },
  {
    id: "stats-2",
    title: "Loans Offered",
    value: 230,
  },
  {
    id: "stats-3",
    title: "Transaction",
    value: 500,
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://content/",
      },
      {
        name: "How it Works",
        link: "https://how-it-works/",
      },
      {
        name: "Create",
        link: "https://create/",
      },
      {
        name: "Explore",
        link: "https://explore/",
      },
      {
        name: "Terms & Services",
        link: "https://terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://help-center/",
      },
      {
        name: "Partners",
        link: "https://partners/",
      },
      {
        name: "Suggestions",
        link: "https://suggestions/",
      },
      {
        name: "Blog",
        link: "https://blog/",
      },
      {
        name: "Newsletters",
        link: "https://newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];

// export const clients = [
//   {
//     id: "client-1",
//     logo: airbnb,
//   },
//   {
//     id: "client-2",
//     logo: binance,
//   },
//   {
//     id: "client-3",
//     logo: coinbase,
//   },
//   {
//     id: "client-4",
//     logo: dropbox,
//   },
// ];
