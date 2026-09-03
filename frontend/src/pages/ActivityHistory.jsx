import { useEffect, useState } from "react";

function ActivityHistory({ bugId }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://127.0.0.1:5000/api/bugs/${bugId}/activity`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setActivities(data.activities);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching activity:", error);
            } finally {
                setLoading(false);
            }
        };

        if (bugId) {
            fetchActivity();
        }
    }, [bugId]);

    if (loading) {
        return <p>Loading activity...</p>;
    }

    return (
        <div className="activity-history">
            <h3>Activity History</h3>

            {activities.length === 0 ? (
                <p>No activity yet.</p>
            ) : (
                <div>
                    {activities.map((activity) => (
                        <div
                            key={activity.activity_id}
                            className="activity-item"
                        >
                            <strong>{activity.action}</strong>

                            <p>{activity.details}</p>

                            <small>
                                By {activity.username} •{" "}
                                {new Date(
                                    activity.created_at
                                ).toLocaleString()}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActivityHistory;