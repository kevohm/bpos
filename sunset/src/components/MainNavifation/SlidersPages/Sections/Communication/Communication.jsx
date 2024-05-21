import React, { useRef, useState } from "react";
import "./WhasApp.scss";
import "./MessageForm.scss";
import whatsappicon from "./whatsapp.png";
import phone from "./phone.png";
import messageIcon from "./meesageIcon.png";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import emailjs from "@emailjs/browser";
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import dukaavt from './dukaavt.png'

const textVariants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
  scrollButton: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

const Communication = () => {
  const phoneNumber = "+254111356555";
  const accountName = "DukaTrack"
  const formRef = useRef();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  const [open, setOpen] = React.useState(false);
  const [isDialog, setIsDialog] = React.useState(true);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const toggle = () => {
    setOpen(!open);
    setIsDialog(!isDialog);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // Set loading state to true
    setLoading(true);

    emailjs
      .sendForm("service_j3dsxi3", "template_gli4oxf", formRef.current, {
        publicKey: "zVBhJkhYorKSJHcoB",
      })
      .then(
        () => {
          setSuccess(true);
          formRef.current.reset();
        },
        (error) => {
          console.error("Error sending email:", error);
          setError(true);
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const dialogContent = (
    <form ref={formRef} onSubmit={sendEmail}>
      <div className="MessageApp">
        <div className="TopMessage">
          <h1>Welcome</h1>
          <p>Let's start with your full name</p>
        </div>
        <div className="Entries">
          <label>Full name</label>
          <input placeholder="full name" name="name" required />
        </div>
        <div className="Entries">
          <label>Email</label>
          <input placeholder="email" name="email" required />
        </div>
        <div className="Entries">
          <label>Phone number</label>
          <input placeholder="+2547..." name="mobile" required />
        </div>
        <div className="Entries">
          <label>Message</label>
          <textarea placeholder="Message" name="message" rows={2} required />
        </div>
        <div className="Entries">
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
        <div>
          <span style={{ color: "red" }}>{error && "Error"}</span>
          <span style={{ color: "green" }}>{success && "Success"}</span>
        </div>
      </div>
    </form>
  );

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        paddingTop: "2vh",
        paddingBottom: "1vh",
        borderRadius: "50px",
      }}
      role="presentation"
    >
      <form ref={formRef} onSubmit={sendEmail}>
        <div className="MessageApp">
          <div className="TopMessage">
            <h1>Welcome</h1>
            <p>Let's start with your full name</p>
          </div>
          <div className="Entries">
            <label>Full name</label>
            <input placeholder="full name" name="name" required />
          </div>
          <div className="Entries">
            <label>Email</label>
            <input placeholder="email" name="email" required />
          </div>
          <div className="Entries">
            <label>Phone number</label>
            <input placeholder="+2547..." name="mobile" required />
          </div>
          <div className="Entries">
            <label>Message</label>
            <textarea placeholder="Message" name="message" rows={2} required />
          </div>
          <div className="Entries">
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
          <div>
            <span style={{ color: "red" }}>{error && "Error"}</span>
            <span style={{ color: "green" }}>{success && "Success"}</span>
          </div>
        </div>
      </form>
    </Box>
  );

  return (
    <div className="WhasApp">
   
        <div> 
        <FloatingWhatsApp
        phoneNumber={phoneNumber}
        accountName={accountName}
        avatar={dukaavt}
        statusMessage = "Typically replies within 30 minutes"
        chatMessage = "Hello there! 🤝 How can we help?"
        backgroundColor="#25D366"
        size="60px" 
        borderRadius="50%" 
        boxShadow="0 4px 8px rgba(0,0,0,0.2)" 
        position={{ bottom: 20, right: 20 }}
      />
      </div>
    
      {/* <button>
        <a href={`tel:${phoneNumber}`}>
          <img src={phone} alt="" />
        </a>
      </button>
      <button onClick={toggle}>
        <img src={messageIcon} alt="" />
      </button> */}

      <div>
        {matches ? (
          <Dialog open={open} onClose={toggle}>
            {dialogContent}
          </Dialog>
        ) : (
          <Drawer anchor="bottom" open={open} onClose={toggle}>
            {drawerContent}
          </Drawer>
        )}
      </div>
    </div>
  );
};

export default Communication;
