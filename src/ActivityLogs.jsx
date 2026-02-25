import { useState, useEffect } from "react";
import API_BASE_URL from "./config";
import "./Table.css";

function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/getActivityLogs`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setLogs(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <div className="main-container fade-in">
            <div className="showdata">
                <div className="btnset1">
                    <h2>Editor Activity Logs</h2>
                    <button className="btn1" onClick={loadLogs}>🔄 Refresh Logs</button>
                </div>

                <div className="table-container">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Action</th>
                                <th>Details</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td style={{ fontWeight: 'bold', color: log.username === 'admin' ? '#007bff' : '#28a745' }}>
                                        {log.username}
                                    </td>
                                    <td>{log.action}</td>
                                    <td>{log.details}</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.length === 0 && !loading && (
                    <p className="no-data">No activities recorded yet.</p>
                )}
                {loading && <p className="no-data">Loading logs...</p>}
            </div>
        </div>
    );
}

export default ActivityLogs;
