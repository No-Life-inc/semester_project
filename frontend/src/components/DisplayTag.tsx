import React, { useState, useEffect } from "react";
import { getTagById, getAllTags } from "../services/apiClient";
import { Tag } from "../types/type";

interface DisplayTagProps {
  tags: Tag[];
}

const DisplayTag: React.FC<DisplayTagProps> = ({ tags: initialTags }) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [tagById, setTagById] = useState<Tag | null>(null);
  const [tagId, setTagId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const handleGetTagById = async () => {
    setError(null);
    try {
      const tag = await getTagById(Number(tagId));
      if (!tag) {
        setMessage("Tag not found. Please check the ID and try again.");
        return;
      }      
      setTagById(tag);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('An error occurred while getting tag by id. Please try again.');
      }
    }
  };

  const handleLoadMoreTags = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const newTags = await getAllTags(nextPage, 10);
      if (newTags.length === 0) setHasMore(false);
      setTags((prevTags) => [...prevTags, ...newTags]);
      setPage(nextPage);
    } catch (error: any) {
      setError("Error fetching more tags");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const fetchFirstPage = async () => {
      if (page === 1) {
        setIsFetching(true);
        setError(null);
        try {
          const firstPageTags = await getAllTags(1, 10);
          setTags(firstPageTags);
          setHasMore(true);
        } catch (err) {
          setError("Error fetching first page tags");
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchFirstPage();
  }, [page]);

  return (
    <div data-testid="tags-container">
        <h1 id="tags-header" data-testid="tags-header">Tags</h1>
        {message && <p style={{ color: "red" }} data-testid="message">{message}</p>}
        <h2 id="all-tags-header" data-testid="all-tags-header">All Tags</h2>
        {message && <p style={{ color: "red" }} data-testid="message">{message}</p>}
        {error && <p style={{ color: "red" }} data-testid="tags-error">{error}</p>}
        {tags.length > 0 ? (
            <ul data-testid="tags-list">
                {tags.map((tag) => (
                    <li key={tag.id} data-testid={`tag-item-${tag.id}`}>
                        {tag.id}: {tag.name}
                    </li>
                ))}
            </ul>
        ) : (
            <p data-testid="no-tags-message">No tags available</p>
        )}

        <div>
            {hasMore && (
                <button
                    onClick={handleLoadMoreTags}
                    disabled={isFetching}
                    data-testid="load-more-tags-button"
                >
                    {isFetching ? "Loading..." : "Load More"}
                </button>
            )}
            {!hasMore && <p data-testid="all-tags-loaded-message">All tags loaded.</p>}
        </div>

        <h2 id="get-tag-by-id-header" data-testid="get-tag-by-id-header">Get Tag By ID</h2>
        <input
            type="number"
            placeholder="Enter Tag ID"
            value={tagId}
            onChange={(e) => setTagId(e.target.value ? Number(e.target.value) : "")}
            data-testid="tag-id-input"
        />
        <button onClick={handleGetTagById} data-testid="get-tag-button">Get Tag</button>
        
        {message && <p style={{ color: "red" }} data-testid="message">{message}</p>}

        {tagById && (
          
            <div data-testid="tag-details-container">
                <h3 id="tag-details-header" data-testid="tag-details-header">Tag Details</h3>
                <p data-testid="tag-details-id">ID: {tagById.id}</p>
                <p data-testid="tag-details-name">Name: {tagById.name}</p>
            </div>
        )}
    </div>
);

};

export default DisplayTag;
