import React, { useState } from "react";
import { createTag } from "../services/apiClient";

interface CreateTagProps {
  onTagCreated: () => void;
}

const CreateTag: React.FC<CreateTagProps> = ({ onTagCreated }) => {
  const [tagName, setTagName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateTag = async () => {
    setError(null);
    if (!tagName.trim()) {
      setError("Tag name is required.");
      return;
    }
    try {
      await createTag(tagName);
      setTagName("");
      onTagCreated();
    } catch (err) {
      setError("Error creating tag.");
    }
  };

  return (
    <div>
      <h2>Create a New Tag</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Enter tag name"
        value={tagName}
        onChange={(e) => setTagName(e.target.value)}
      />
      <button onClick={handleCreateTag}>Create Tag</button>
    </div>
  );
};

export default CreateTag;
