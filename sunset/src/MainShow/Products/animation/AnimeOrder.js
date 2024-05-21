import React from "react";
import Lottie from "lottie-react";
import delivery from "./orderanime.json";


export default function AnimeOrder(){
    return <Lottie animationData={delivery} loop={true} style={{height:'60px',width:'100%'}}/>
}
