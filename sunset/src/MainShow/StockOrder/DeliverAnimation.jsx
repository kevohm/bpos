import React from "react";
import Lottie from "lottie-react";
import delivery from "./assets/Animation - 1710319594685.json";


export default function DeliverAnimation(){
    return <Lottie animationData={delivery} loop={true} style={{height:'100px',width:'100%'}}/>
}
