import { useState, useEffect } from "react";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import "./Form.css";


function AddEditor() {
    const { logAction } = useAuth();
    const { toast, confirm } = useToast();

    const [editors, setEditors] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [permissions, setPermissions] = useState({
        dashboard: true,
        lawyers: true,
        cases: true,
        assign: false,
        addlawyer: false,
        adduser: false,
        report: false
    });

    const loadEditors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/getEditors`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setEditors(data);
            } else {
                console.error("Expected array but got:", data);
                setEditors([]);
            }
        } catch (error) {
            console.error("Failed to fetch editors:", error);
            setEditors([]);
        }
    };

    useEffect(() => {
        loadEditors();
    }, []);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setPermissions(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Filter out categories that are false
        const selectedPermissions = Object.keys(permissions).filter(k => permissions[k]);

        const res = await fetch(`${API_BASE_URL}/addEditor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, permissions: selectedPermissions }),
        });

        const data = await res.json();
        if (data.status === "success") {
            logAction("Create Editor", `Created new editor account: ${username}`);
            toast("Editor added successfully!", "success");
            setUsername("");
            setPassword("");
            loadEditors();
        } else {
            toast("Error: " + data.message, "error");
        }
    };

    const deleteEditor = async (id) => {
        const confirmed = await confirm("This editor account will be permanently removed.", "Delete Editor?", "danger");
        if (!confirmed) return;
        await fetch(`${API_BASE_URL}/deleteEditor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        logAction("Delete Editor", `Removed editor with ID: ${id}`);
        toast("Editor removed successfully.", "success");
        loadEditors();
    };

    return (
        <div className="main-container fade-in">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <h2>Add New Editor</h2>
                    <label>Username</label>
                    <input
                        type="text"
                        className="field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        className="field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div style={{ marginTop: '20px' }}>
                        <h3>Set Permissions</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                            {Object.keys(permissions).map(key => (
                                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        name={key}
                                        checked={permissions[key]}
                                        onChange={handleCheckboxChange}
                                    />
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace('adduser', 'Add Case')}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="btnset">
                        <button type="submit" className="submit">Create Editor</button>
                    </div>
                </form>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2>Existing Editors</h2>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Permissions</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editors.map(ed => (
                            <tr key={ed.id}>
                                <td>{ed.username}</td>
                                <td>{(() => {
                                    try {
                                        const perms = typeof ed.permissions === 'string' ? JSON.parse(ed.permissions) : ed.permissions;
                                        return Array.isArray(perms) ? perms.join(", ") : "None";
                                    } catch (e) {
                                        return "Invalid Permissions";
                                    }
                                })()}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => deleteEditor(ed.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddEditor;
