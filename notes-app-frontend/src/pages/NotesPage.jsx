
/* eslint-disable */
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../api/note.jsx";

export default function NotesPage() {


  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isNew, setIsNew] = useState(false);

  const { data, refetch } = useGetNotesQuery(search);
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const notes = Array.isArray(data) ? data : [];

  // Keep the open editor in sync if the underlying note list refreshes
  useEffect(() => {
    if (selected) {
      const fresh = notes.find((n) => n.id === selected.id);
      if (fresh) setSelected(fresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const openNote = (note) => {
    setSelected(note);
    setTitle(note.title);
    setContent(note.content);
    setIsNew(false);
  };

  const newNote = () => {
    setSelected(null);
    setTitle("");
    setContent("");
    setIsNew(true);
  };

  const saveNote = async () => {
    if (!title.trim()) return;

    if (isNew) {
      await createNote({ title, content });
    } else if (selected) {
      await updateNote({ id: selected.id, title, content });
    }
    setIsNew(false);
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    setSelected(null);
    setTitle("");
    setContent("");
    refetch();
  };

  const formatDate = (d) =>
      new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
      <div className="page">
        <Header />
        <div className="notes-layout">
          <aside className="sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title">All Notes</span>
              <button onClick={newNote} className="new-btn">+</button>
            </div>
            <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search"
            />
            <div className="notes-list">
              {notes.map((note) => (
                  <div
                      key={note.id}
                      onClick={() => openNote(note)}
                      className={`note-item ${selected?.id === note.id ? "active" : ""}`}
                  >
                    <div className="note-item-title">{note.title}</div>
                    <div className="note-item-preview">{note.content.slice(0, 60)}...</div>
                    <div className="note-item-date">{formatDate(note.updated_at)}</div>
                  </div>
              ))}
              {notes.length === 0 && <p className="empty-list">No notes found.</p>}
            </div>
          </aside>

          <main className="editor">
            {selected || isNew ? (
                <>
                  <div className="editor-header">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="title-input"
                    />
                    <div className="editor-actions">
                      <button onClick={saveNote} className="save-btn">Save</button>
                      {selected && (
                          <button onClick={() => handleDelete(selected.id)} className="delete-btn">
                            Delete
                          </button>
                      )}
                    </div>
                  </div>
                  <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start writing..."
                      className="content-area"
                  />
                </>
            ) : (
                <div className="empty-editor">
                  <p>Select a note or create a new one</p>
                  <button onClick={newNote} className="new-btn-lg">+ New Note</button>
                </div>
            )}
          </main>
        </div>
      </div>
  );
}
