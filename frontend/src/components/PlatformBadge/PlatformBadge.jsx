import "./PlatformBadge.css";

import leetcodeIcon    from "../../assets/icons/leetcode.svg";
import codeforcesIcon  from "../../assets/icons/codeforces.svg";
import codechefIcon    from "../../assets/icons/codechef.svg";
import atcoderIcon     from "../../assets/icons/atcoder.svg";
import csesIcon        from "../../assets/icons/cses.svg";
import gfgIcon         from "../../assets/icons/geeksforgeeks.svg";

const PLATFORM_META = {
    LeetCode:      { icon: leetcodeIcon,   url: "https://leetcode.com/problemset/" },
    Codeforces:    { icon: codeforcesIcon,  url: "https://codeforces.com/problemset" },
    CodeChef:      { icon: codechefIcon,    url: "https://www.codechef.com/problems/school" },
    AtCoder:       { icon: atcoderIcon,     url: "https://atcoder.jp/contests/" },
    CSES:          { icon: csesIcon,        url: "https://cses.fi/problemset/" },
    GeeksforGeeks: { icon: gfgIcon,         url: "https://www.geeksforgeeks.org/explore" },
};

function PlatformBadge({ platform }) {

    const meta = PLATFORM_META[platform];

    if (!meta) return null;

    return (
        <a
            className="platform-badge"
            href={meta.url}
            target="_blank"
            rel="noopener noreferrer"
            title={platform}
        >
            <img
                src={meta.icon}
                alt={platform}
                className="platform-badge-icon"
            />
        </a>
    );

}

export default PlatformBadge;