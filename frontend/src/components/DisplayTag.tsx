import React, { useState, useEffect } from "react";
import { getAllTags, getTagById, deleteTagById } from "../services/apiClient";
import { Tag } from "../types/type";

interface DisplayTagProps {
    tags: Tag[];
    onDeleteTag: (id: number) => void;
  }

const DisplayTag:  React.FC<DisplayTagProps> = ({ tags, onDeleteTag }) => {
  const [tagById, setTagById] = useState<Tag | null>(null);
  const [tagId, setTagId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleGetTagById = async () => {
    setError(null);
    if (!tagId) {
      setError("Please enter a valid ID");
      return;
    }
    try {
      const tag = await getTagById(Number(tagId));
      setTagById(tag);
    } catch (err) {
      setError("Error fetching tag by ID");
    }
  };

  return (
    <div>
      <h1>Tags</h1>
      <h2>All Tags</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tags.length > 0 ? (
        <ul>
          {tags.map((tag) => (
            <li key={tag.id}>
              {tag.id}: {tag.name}
              <button onClick={() => onDeleteTag(tag.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tags available</p>
      )}

      <h2>Get Tag By ID</h2>
      <input
        type="number"
        placeholder="Enter Tag ID"
        value={tagId}
        onChange={(e) => setTagId(e.target.value ? Number(e.target.value) : "")}
      />
      <button onClick={handleGetTagById}>Get Tag</button>

      {tagById && (
        <div>
          <h3>Tag Details</h3>
          <p>ID: {tagById.id}</p>
          <p>Name: {tagById.name}</p>
        </div>
      )}
    </div>
  );
};

export default DisplayTag;
