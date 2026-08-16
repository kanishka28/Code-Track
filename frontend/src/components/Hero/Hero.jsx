import React from "react";
import {
  FaCheckCircle,
  FaStar,
  FaBookOpen,
  FaLayerGroup,
  FaListOl
} from "react-icons/fa";

import { useProgress } from "../../context/ProgressContext";

import "./Hero.css";

function Hero() {

  const { summary, loading: loadingStats } = useProgress();

  const completed = summary?.questionsCompleted ?? {};
  const revision = summary?.markedForRevision ?? {};

  const displayStat = (value) =>
    loadingStats ? "..." : (value ?? 0);

  return (
    <section className="hero">

      <div className="hero-left">

        <div className="hero-badge">
          🚀 Your Complete DSA & CP Companion
        </div>

        <h1>
          Master DSA.
          <br />
          Stay Contest Ready.
          <br />
          Practice <span className="highlight-blue">Smarter.</span>
        </h1>

        <p>
          Everything you need for coding interviews and competitive programming
          in one place. Track contests, follow coding sheets, monitor progress,
          save notes, bookmark problems, and build consistency.
        </p>

      </div>

      <div className="hero-right">

        <div className="stats-grid">

          {/* ===================== QUESTIONS COMPLETED ===================== */}

          <div className="stats-box">

            <div className="stats-box-header">
              <FaCheckCircle className="subsection-icon completed" />
              <span>Completed</span>
              <strong className="subsection-total">
                {displayStat(completed.total)}
              </strong>
            </div>

            <div className="stat">
              <div className="stat-left">
                <div className="icon-box blue">
                  <FaBookOpen />
                </div>
                <span>NeetCode 150</span>
              </div>
              <strong>{displayStat(completed.neetcode150)}</strong>
            </div>

            <div className="stat">
              <div className="stat-left">
                <div className="icon-box green">
                  <FaBookOpen />
                </div>
                <span>Blind 75</span>
              </div>
              <strong>{displayStat(completed.blind75)}</strong>
            </div>

            <div className="stat">
              <div className="stat-left">
                <div className="icon-box yellow">
                  <FaLayerGroup />
                </div>
                <span>Striver A2Z</span>
              </div>
              <strong>{displayStat(completed.striver)}</strong>
            </div>

            <div className="stat">
              <div className="stat-left">
                <div className="icon-box purple">
                  <FaListOl />
                </div>
                <span>CSES</span>
              </div>
              <strong>{displayStat(completed.cses)}</strong>
            </div>

          </div>

          {/* ===================== MARKED FOR REVISION ===================== */}

          <div className="stats-box">

            <div className="stats-box-header">
              <FaStar className="subsection-icon revision" />
              <span>Revision</span>
              <strong className="subsection-total">
                {displayStat(revision.total)}
              </strong>
            </div>

            <div className="stat">
              <div className="stat-left">
                <div className="icon-box blue">
                  <FaBookOpen />
                </div>
                <span>NeetCode 150</span>
              </div>
              <strong>{displayStat(revision.neetcode150)}</strong>
            </div>

            <div className="stat">
              <div className="stat-left">
                <div className="icon-box green">
                  <FaBookOpen />
                </div>
                <span>Blind 75</span>
              </div>
              <strong>{displayStat(revision.blind75)}</strong>
            </div>

            <div className="stat">
              <div className="stat-left">
                <div className="icon-box yellow">
                  <FaLayerGroup />
                </div>
                <span>Striver A2Z</span>
              </div>
              <strong>{displayStat(revision.striver)}</strong>
            </div>

            <div className="stat">
              <div className="stat-left">
                <div className="icon-box purple">
                  <FaListOl />
                </div>
                <span>CSES</span>
              </div>
              <strong>{displayStat(revision.cses)}</strong>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;