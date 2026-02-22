import React, { useState, useEffect } from "react";

export default function Comments() {

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [lang, setLang] = useState("hi");
  const [city, setCity] = useState("Detecting...");

  // ===== AUTO CITY =====
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => setCity(data.city || "Unknown City"))
      .catch(() => setCity("Unknown City"));
  }, []);

  // ===== BLOCK SPECIAL =====
  const containsSpecial = (text) => {
    return /[!@#$%^&*(),.?":{}|<>]/.test(text);
  };

  // ===== POST =====
  const postComment = () => {
    if (!comment.trim()) return alert("Enter comment");

    if (containsSpecial(comment)) {
      alert("❌ Special characters not allowed");
      return;
    }

    const newComment = {
      text: comment,
      likes: 0,
      dislikes: 0,
      translated: ""
    };

    setComments([...comments, newComment]);
    setComment("");
  };

  // ===== LIKE =====
  const like = (i) => {
    const arr = [...comments];
    arr[i].likes++;
    setComments(arr);
  };

  // ===== DISLIKE =====
  const dislike = (i) => {
    const arr = [...comments];
    arr[i].dislikes++;

    if (arr[i].dislikes >= 2) {
      arr.splice(i, 1);
    }
    setComments(arr);
  };

  // ===== TRANSLATE (SHOW BELOW) =====
  const translate = async (index) => {
    const txt = comments[index].text;

    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(txt)}`
      );

      const data = await res.json();
      const translatedText = data[0].map(item => item[0]).join("");

      const updated = [...comments];
      updated[index].translated = translatedText;
      setComments(updated);

    } catch {
      alert("Translation failed");
    }
  };

  return (
    <div style={{
      maxWidth: "700px",
      margin: "40px auto",
      padding: "30px",
      background: "#0f172a",
      borderRadius: "15px",
      boxShadow: "0 0 25px rgba(0,255,255,0.4)",
      color: "white"
    }}>

      <h2 style={{ textAlign: "center" }}>💬 Comment Section</h2>
      <p style={{ textAlign: "center" }}>📍 Your City: {city}</p>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write comment..."
        style={{
          width: "100%",
          height: "80px",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          marginBottom: "15px"
        }}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <select value={lang} onChange={(e) => setLang(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px" }}>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
        </select>

        <button onClick={postComment}
          style={{ padding: "10px 20px", background: "cyan", border: "none", borderRadius: "6px" }}>
          Post
        </button>
      </div>

      <hr />

      {comments.map((c, i) => (
        <div key={i} style={{
          background: "#020617",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "15px"
        }}>
          <b>{c.text}</b>

          {/* TRANSLATED SHOW */}
          {c.translated && (
            <p style={{ color: "#22c55e", marginTop: "5px" }}>
              🌐 {c.translated}
            </p>
          )}

          <div style={{ marginTop: "10px" }}>
            <button onClick={() => like(i)}>👍 {c.likes}</button>
            <button onClick={() => dislike(i)} style={{ marginLeft: "10px" }}>
              👎 {c.dislikes}
            </button>
            <button onClick={() => translate(i)} style={{ marginLeft: "10px" }}>
              🌍 Translate
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}