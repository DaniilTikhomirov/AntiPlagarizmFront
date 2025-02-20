import React, { useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import "./Table.css"

function Table() {
    const { id } = useParams();
    const [students, setStudents] = useState([]);
    const [similarityMatrix, setSimilarityMatrix] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/check/${id}`, {
                    method: 'GET',
                    headers: {
                        'accept': '*/*'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const result = await response.json();
                console.log(result);

                // Используем Set для уникального списка студентов
                const studentsSet = new Set();
                const similarityMap = new Map();

                result.forEach(({ student1, student2, similarity }) => {
                    const name1 = `${student1.firstName} ${student1.lastName}`;
                    const name2 = `${student2.firstName} ${student2.lastName}`;
                    studentsSet.add(name1);
                    studentsSet.add(name2);

                    const key1 = `${name1}-${name2}`;
                    const key2 = `${name2}-${name1}`;
                    similarityMap.set(key1, similarity);
                    similarityMap.set(key2, similarity);
                });

                const studentsList = Array.from(studentsSet);
                setStudents(studentsList);

                // Создаем матрицу схожести
                const matrix = studentsList.map((student1) =>
                    studentsList.map((student2) => {
                        const key = `${student1}-${student2}`;
                        return similarityMap.has(key) ? similarityMap.get(key).toFixed(2) : '-';
                    })
                );

                setSimilarityMatrix(matrix);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchData();
    }, []);

    const getCellColor = (value) => {
        if (value === '-') return 'rgba(255, 255, 255, 1)';
        let percentage = parseFloat(value) / 4;

        if (percentage > 15) {
            percentage *= 4;
        }
        const red = Math.min(255, Math.round(percentage * 2.55));

        return `rgba(255, ${255 - red}, ${255 - red}, 0.5)`;
    };

    return (
        <div className="App">
            <h1>Сравнение студентов</h1>
            <button className={"backButton"} onClick={() => navigate(-1)}>Назад</button>
            <table>
                <thead>
                <tr>
                    <th></th>
                    {students.map((student, index) => (
                        <th key={index}>{student}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {students.map((student1, rowIndex) => (
                    <tr key={rowIndex}>
                        <td>{student1}</td>
                        {students.map((student2, colIndex) => (
                            <td
                                key={colIndex}
                                style={{backgroundColor: getCellColor(similarityMatrix[rowIndex][colIndex])}}
                                title={`${student1} - ${student2}`}
                            >
                                {similarityMatrix[rowIndex][colIndex] === '-' ? '-' : similarityMatrix[rowIndex][colIndex] + '%'}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
