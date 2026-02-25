import { useEffect, useState, useMemo } from "react";
import "./Table.css";
import "./Report.css";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";

function GenerateReport() {
    const { hasPermission } = useAuth();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Load report data from standalone database
    const loadReportData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/getReportData`, {
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (Array.isArray(data)) {
                setReportData(data);
                setLastUpdated(new Date());
            } else {
                throw new Error("Invalid data format received from server");
            }
        } catch (error) {
            console.error("Error loading report data:", error);
            setError(error.message);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReportData();
    }, []);

    // Filter data based on case type - Memoized for performance
    const filteredData = useMemo(() => {
        return filterType === "all"
            ? reportData
            : reportData.filter(item => item.casetype === filterType);
    }, [reportData, filterType]);

    // Get unique case types for filter - Memoized
    const caseTypes = useMemo(() => {
        return [...new Set(reportData.map(item => item.casetype))];
    }, [reportData]);

    // Memoized statistics calculation
    const stats = useMemo(() => {
        const assigned = filteredData.filter(item => item.lawyer1).length;
        const unassigned = filteredData.filter(item => !item.lawyer1).length;
        const upcoming = filteredData.filter(item => {
            if (!item.next_date) return false;
            const nextDate = new Date(item.next_date);
            const today = new Date();
            const diff = (nextDate - today) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= 30;
        }).length;

        return { assigned, unassigned, upcoming };
    }, [filteredData]);

    // Print report
    const handlePrint = () => {
        window.print();
    };

    // Export to CSV
    const handleExportCSV = () => {
        const headers = ["Name", "NIC", "Email", "Contact", "Address", "Case Type", "Assigned Lawyer", "Status", "Last Court Date", "Next Court Date", "Notes"];
        const csvData = filteredData.map(row => [
            row.name,
            row.nic,
            row.email,
            row.number,
            row.address,
            row.casetype,
            row.lawyer1 || "Not Assigned",
            row.status || "ongoing",
            row.last_date,
            row.next_date,
            row.note || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `case_report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="main-container fade-in">
            <div className="report-header">
                <div>
                    <h2>Case Management Report</h2>
                    {lastUpdated && (
                        <p className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </p>
                    )}
                </div>
                <div className="report-actions">
                    <select
                        className="searchbar"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ marginRight: '0.75rem' }}
                    >
                        <option value="all">All Case Types</option>
                        {caseTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button className="btn1" onClick={loadReportData} disabled={loading}>
                        🔄 {loading ? "Refreshing..." : "Refresh Data"}
                    </button>
                    <button className="btn1" onClick={handlePrint} disabled={!hasPermission('report')}>
                        🖨️ Print Report
                    </button>
                    <button className="btn1" onClick={handleExportCSV} disabled={!hasPermission('report')}>
                        📊 Export CSV
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-msg">
                    ⚠️ Error: {error}. Please check your database connection.
                </div>
            )}

            {loading ? (
                <p className="no-data">Loading real-time data from database...</p>
            ) : (
                <>
                    <div className="report-summary">
                        <div className="summary-card total-card">
                            <h4>Total Cases</h4>
                            <p className="summary-number">{filteredData.length}</p>
                        </div>
                        <div className="summary-card assigned-card">
                            <h4>Assigned Cases</h4>
                            <p className="summary-number">{stats.assigned}</p>
                        </div>
                        <div className="summary-card unassigned-card">
                            <h4>Unassigned Cases</h4>
                            <p className="summary-number">{stats.unassigned}</p>
                        </div>
                        <div className="summary-card upcoming-card">
                            <h4>Upcoming Hearings</h4>
                            <p className="summary-number">{stats.upcoming}</p>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Case Number</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Address</th>
                                    <th>Court Type</th>
                                    <th>Assigned Lawyer</th>
                                    <th>Status</th>
                                    <th>Last Court Date</th>
                                    <th>Next Court Date</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row) => (
                                    <tr key={row.nic}>
                                        <td>{row.name}</td>
                                        <td>{row.nic}</td>
                                        <td>{row.email}</td>
                                        <td>{row.number}</td>
                                        <td>{row.address || "-"}</td>
                                        <td>{row.casetype}</td>
                                        <td>
                                            <span className={row.lawyer1 ? "assigned" : "unassigned"}>
                                                {row.lawyer1 || "Not Assigned"}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                backgroundColor: row.status === 'concluded' ? '#d4edda' : row.status === 'ongoing' ? '#fff3cd' : '#e2e3e5'
                                            }}>
                                                {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Ongoing'}
                                            </span>
                                        </td>
                                        <td>{row.last_date}</td>
                                        <td>{row.next_date}</td>
                                        <td>{row.note || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredData.length === 0 && (
                        <p className="no-data">No records found for the selected filter.</p>
                    )}
                </>
            )}
        </div>
    );
}

export default GenerateReport;
