import React from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import android from "../assets/android1.png"
import ios from "../assets/ios.png"
import harmonyos from "../assets/harmonyos1.png"

const MobileOSCard = ({ logo, title, description }) => (
  <motion.div
    className="bg-gray-800 rounded-xl p-11 flex items-start gap-4 mb-6 shadow-md transition-transform duration-300 border-2 border-gray-600"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <img src={logo} className="w-25 h-25 object-contain" />
    <div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-base leading-relaxed text-white">{description}</p>
    </div>
  </motion.div>
);

const OverviewTest = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview of Mobile Operating System" />

      <main className="max-w-5xl mx-auto py-8 px-1">
        <MobileOSCard
          logo={android} 
          title="Android"
          description="Android is a mobile OS that provide open-source using Linux Kernal which was launched in 2008 by Google. 
          Since its introduction, Android has remained the most popular used mobile OS around the world that powering millions of 
          mobile devices such as mobile phones, tablets and Android TVs. Flexible system, extensive app ecosystem, and compatibility 
          with various hardware configurations are the reasons for the increase in popularity in the use of mobile devices.  
          It supports extensive customization and app development. The platform used by the Android operating system to access 
          applications is Google Play Store. Google Play store was launched in 2008 which is an app store for all android devices. 
          One of the main features of which is Google Play Protect, which works as a security mechanism to ensure the safety of the 
          mobile device."
        />
        <MobileOSCard
          logo={ios} 
          title="iOS"
          description="iOS is a mobile OS produced by Apple company in 2007 for several devices such as iPhones, iPads and iPods. 
          The first version of the operating system is iPhone OS which were installed on iPhone and iPod devices which at that time was 
          managed under the name IOS in 2010. IOS emphasizes a secure, user-friendly experience and also maintains high performance 
          for users. Since its first appearance, iOS has experienced significant progress to become a sophisticated platform around 
          the world. In addition, iOS also produces a platform that provides access to millions of applications across various categories 
          to users, namely the iOS App Store. User experience is also prioritized by iOS by creating features such as intuitive gestures, 
          accessibility tools, and seamless synchronization with other devices through the iCloud service. Known for its smooth performance, 
          strong security, and integration with Apple’s ecosystem."
        />
        <MobileOSCard
          logo={harmonyos} 
          title="HarmonyOS"
          description="HarmonyOS is a microkernel-based operating system that began operating in 2019 and was developed by a Chinese 
          company, Huawei, which was initially intended for Internet of Things (IoT) devices. The production of HarmonyOS aims to reduce 
          dependence on external operating systems such as Android and iOS. There are several important HarmonyOS system architectures 
          consisting of kernel layer, framework layer, system service layer, and application layer. Huawei has created AppGalerry which 
          serves as the main application distribution platform for HarmonyOS. Google services have been replaced by Huawei Mobile Services (HMS) 
          as the search engine. HarmonyOS emphasizes diversity and connectivity in a unified ecosystem across many devices such as mobile 
          phones, tablets, smart TVs, and IoT devices. It aims to provide a unified experience across multiple device types including 
          smartphones, tablets, TVs."
        />
      </main>
    </div>
  );
};

export default OverviewTest;
