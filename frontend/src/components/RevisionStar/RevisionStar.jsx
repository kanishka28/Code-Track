import "./RevisionStar.css";

function RevisionStar({ active, onClick }) {
  return (
    <button
      className={`revision-star ${active ? "active" : ""}`}
      onClick={onClick}
    >
      ★
    </button>
  );
}

export default RevisionStar;