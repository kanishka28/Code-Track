import React from "react";
import "./PlatformCard.css";

import leetcodeIcon    from "../../assets/icons/leetcode.svg";
import codeforcesIcon  from "../../assets/icons/codeforces.svg";
import codechefIcon    from "../../assets/icons/codechef.svg";
import atcoderIcon     from "../../assets/icons/atcoder.svg";
import csesIcon        from "../../assets/icons/cses.svg";
import gfgIcon         from "../../assets/icons/geeksforgeeks.svg";

const PLATFORMS = [
  { name: "LeetCode",      icon: leetcodeIcon,   count: "2500+ Problems", url: "https://leetcode.com/problemset/",                   colorClass: "leetcode"   },
  { name: "Codeforces",    icon: codeforcesIcon,  count: "1000+ Problems", url: "https://codeforces.com/problemset",                  colorClass: "codeforces" },
  { name: "CodeChef",      icon: codechefIcon,    count: "3000+ Problems", url: "https://www.codechef.com/problems/school",           colorClass: "codechef"   },
  { name: "AtCoder",       icon: atcoderIcon,     count: "1000+ Problems", url: "https://atcoder.jp/contests/",                       colorClass: "atcoder"    },
  { name: "CSES",          icon: csesIcon,        count: "300+ Problems",  url: "https://cses.fi/problemset/",                        colorClass: "cses"       },
  { name: "GeeksforGeeks", icon: gfgIcon,         count: "DSA Articles",   url: "https://www.geeksforgeeks.org/explore",              colorClass: "gfg"        },
];

function PlatformCard() {
  return (
    <section className="platform-section">

      <h2>Practice Across Top Coding Platforms</h2>

      <p>
        Solve problems from the world's most popular coding platforms.
      </p>

      <div className="platform-grid">

        {PLATFORMS.map((p) => (
          <a
            key={p.name}
            className="platform-card"
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={p.icon}
              alt={p.name}
              className={`platform-icon ${p.colorClass}`}
            />
            <h3>{p.name}</h3>
            <span>{p.count}</span>
          </a>
        ))}

      </div>

    </section>
  );
}

export default PlatformCard;