import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

export function ActivationPage() {
  const [code, setCode] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const apiUrl = `http://localhost:8088/api/v1/auth/activate-account?token=${code}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setSuccess(true);
          setError(null);
          console.log("Activation successful:", data);

          // Redirect to login page after successful activation
          setTimeout(() => {
            navigate("/auth/login");
          }, 1500); // Delay of 1.5 seconds before redirecting
        } else {
          // Handle case where there is no JSON response (e.g., 204 No Content)
          setSuccess(true);
          setError(null);
          console.log("Activation successful with no response body.");

          // Redirect to login page after successful activation
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Activation failed");
        setSuccess(false);
        console.error("Error response:", errorData);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error during activation:", err.message);
        setError("Something went wrong: " + err.message);
      } else {
        console.error("Unknown error during activation:", err);
        setError("Something went wrong. Please try again.");
      }
      setSuccess(false);
    }
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Activate Your Account</h1>
      <p style={styles.subtitle}>Enter the 6-digit code sent to your email.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={code}
          onChange={handleChange}
          maxLength={6}
          placeholder="••••••"
          style={styles.input}
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: isHovered ? "#0056b3" : "#007bff",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Submit
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Activation successful! Redirecting...</p>}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "400px",
    margin: "auto",
    display: "block",
  },
  title: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#777",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    padding: "15px",
    fontSize: "24px",
    textAlign: "center",
    letterSpacing: "8px",
    width: "200px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fafafa",
  },
  button: {
    padding: "12px 20px",
    fontSize: "18px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};
