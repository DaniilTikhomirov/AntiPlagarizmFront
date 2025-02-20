import React, { useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./HomeWorkList.css"

function HomeworkList() {
    const [homeworks, setHomeworks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHomeworks = async () => {
            try {
                const response = await fetch('http://localhost:8000/homework', {
                    method: 'GET',
                    headers: {
                        'accept': '*/*'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const result = await response.json();
                setHomeworks(result);
            } catch (error) {
                console.error('Ошибка при получении списка домашних работ:', error);
            }
        };

        fetchHomeworks();
    }, []);

    return (
        <div className="homework-list">
            <h1>Список домашних работ</h1>
            {homeworks.map((hw) => (
                <button key={hw.id} onClick={() => navigate(`/compare/${hw.id}`)}>
                    {hw.title}
                </button>
            ))}
        </div>

    );
}

export default HomeworkList;