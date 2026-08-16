import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import PlatformCard from "../../components/PlatformCard/PlatformCard";
import Footer from "../../components/Footer/Footer";

import "./Home.css";

function Home() {
  return (
    <div className="home-container">

      <Sidebar />

      <div className="home-content">

        <Navbar />

        <main className="home-main">

          <Hero />

          <PlatformCard />

        </main>

        <Footer />

      </div>

    </div>
  );
}

export default Home;