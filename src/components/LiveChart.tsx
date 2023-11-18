import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';

const LiveChart = () => {



    const [selectedCandleTime, setSelectedCandleTime] = useState<any>(1);
    const [candlestickData, setCandlestickData] = useState<any>([]);
    const [type, setType] = useState<any>('Nifty')


    // Chart required Attribute Data 
    const [chartData, setChartData] = useState<any>({
        series: [
            {
                name: 'candle',
                data: [],
            },
        ],
        options: {
            chart: {
                height: 550,
                type: 'candlestick',
                id: 'candles',
                toolbar: {
                    autoSelected: 'pan',
                },
            },
            zoom: {
                enabled: true,
            },
            title: {
                text: `CandleStick Chart`,
                align: 'center',
                style: {
                    color: 'white',
                },
            },
            plotOptions: {
                candlestick: {
                    wick: {
                        useFillColor: true,
                    },
                },
            },
            annotations: {
                xaxis: [
                    {
                        x: '09 15:00',
                        borderColor: '#00E396',
                        label: {
                            borderColor: '#00E396',
                            style: {
                                fontSize: '12px',
                                color: '#d15500',
                                background: '#fff',
                            },
                            orientation: 'horizontal',
                            offsetY: 7,
                            text: 'Annotation Test',
                        },
                    },
                ],
            },
            tooltip: {
                enabled: true,
            },
            xaxis: {
                type: 'date',
                labels: {
                    formatter: (val: any) => dayjs(val).format('HH:mm:ss'),
                    style: {
                        color: 'white',
                    },
                },
            },
            yaxis: {
                tooltip: {
                    enabled: true,
                },
            },
        },
    });





    // time interval handling function 
    useEffect(() => {
        const generateRandomCandlestickData = () => {
            const newData = {
                x: new Date(),
                y: Array.from({ length: 4 }, () => getRandomNumber(18000, 20000)),
            };

            setCandlestickData((prevData: any) => [...prevData, newData]);
            localStorage.setItem('candlestickData', JSON.stringify([...candlestickData, newData]));
        };

        const intervalId = setInterval(generateRandomCandlestickData, selectedCandleTime * 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedCandleTime]);




    // Random number generation function
    const getRandomNumber = (min: any, max: any) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };




    // time plot handler function
    const handleUserInput = () => {
        setCandlestickData([]);
        localStorage.removeItem('candlestickData');

        const newDataArray = Array.from({ length: 10 }, (_, index) => {
            const interval = selectedCandleTime * 60 * 1000;
            const timestamp = Date.now() - index * interval;
            return {
                x: new Date(timestamp),
                y: Array.from({ length: 4 }, () => getRandomNumber(18000, 20000)),
            };
        });




        // storing data in local storage
        setCandlestickData(newDataArray);
        localStorage.setItem('candlestickData', JSON.stringify(newDataArray));




        // set State of chatdata  by using generated data 
        setChartData((prevChartData: any) => {
            const updatedSeries = [
                {
                    name: 'candle',
                    data: newDataArray,
                },
            ];
            return { ...prevChartData, series: updatedSeries };
        });

    };







    // Url of websocket server

    const Url = 'wss://functionup.fintarget.in/ws?id=fintarget-functionup';

    // Getting data from server every second and setting in chartdata.series.data

    useEffect(() => {
        const socket = new WebSocket(Url);

        socket.onmessage = (event) => {
            const meta = JSON.parse(event.data);




            setChartData((prevChartData: any) => {
                const newData = {
                    x: new Date(),
                    y: [19400, getRandomNumber(18000, 20000), getRandomNumber(meta[type], 20000), meta[type]],
                };


                const updatedSeries = [
                    {
                        name: 'candle',
                        data: [...prevChartData.series[0].data, newData],
                    },
                ];

                console.log(updatedSeries);


                return { ...prevChartData, series: updatedSeries };
            });
        };

        return () => {
            socket.close();
        };
    }, []);


    // change the Type 
    const handleNifty = (e: any) => {
        e.preventDefault();
        setType('Nifty');

    }
    const handleBankNifty = (e: any) => {
        e.preventDefault();
        setType('BankNifty');

    }
    const handleFinNifty = (e: any) => {
        e.preventDefault();
        setType('FinNifty');

    }



    return (
        <div className='mainchart'>
            <div className='upermenu'>
                <h1>Trade Bazaree</h1>
                <select
                    value={selectedCandleTime}
                    onChange={(e) => setSelectedCandleTime(Number(e.target.value))}
                >
                    <option value={1}>1 minute</option>
                    <option value={3}>3 minutes</option>
                    <option value={5}>5 minutes</option>
                </select>
                <button onClick={handleUserInput} className='butn'>
                    Update Chart
                </button>

                <button onClick={handleNifty} style={{ padding: '0 8px', margin: '0 8px' }}>Nifty</button>
                <button onClick={handleBankNifty} style={{ padding: '0 8px', margin: '0 8px' }}>BankNifty</button>
                <button onClick={handleFinNifty} style={{ padding: '0 8px', margin: '0 8px' }}>FinNifty</button>

            </div>
            <div className='chart'>
                <h1>{type}</h1>
                <ReactApexChart options={chartData.options} series={chartData.series} type='candlestick' height={550} />
            </div>
        </div>
    );
};

export default LiveChart;   