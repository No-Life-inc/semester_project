import React, { useState } from "react";
import { createTag } from "../services/apiClient";

interface CreateTagProps {
  onTagCreated: () => void;
}

const CreateTag: React.FC<CreateTagProps> = ({ onTagCreated }) => {
  const [tagName, setTagName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        // Show the error message from the API response
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred while creating tag. Please try again.');
      }
    }
  };

  return (
    <div data-testid="create-tag-container">
        <h2 id="create-tag-header" data-testid="create-tag-header">Create a New Tag</h2>
        {error && <p style={{ color: "red" }} data-testid="create-tag-error">{error}</p>}
        <input
            type="text"
            placeholder="Enter tag name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            data-testid="tag-name-input"
        />
        <button onClick={handleCreateTag} data-testid="create-tag-button">
            Create Tag
        </button>
    </div>
);

};

export default CreateTag;
