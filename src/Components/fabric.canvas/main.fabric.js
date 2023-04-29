import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

const FabricCanvas = () => {

    const [canvas, setCanvas] = useState('');

    const [imgURL, setImgURL] = useState('');

    const [firstPoint, setFirstPoint] = useState(undefined);

    const [secondPoint, setSecondPoint] = useState(undefined);

    useEffect(() => {
        setCanvas(initCanvas());
        // canvas.selection = false;
    }, []);


    const initCanvas = () => (
        new fabric.Canvas('canvas', {
            height: 500,
            width: 1336,
            backgroundColor: 'azure'
        })
    )

    const addImg = (e, url, canvi) => {
        e.preventDefault();
        new fabric.Image.fromURL(URL.createObjectURL(url), img => {
            //     img.scale(0.75);
            //     canvi.add(img);
            //     canvi.renderAll();
            //     setImgURL('');
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
            });
        });
    }

    useEffect(() => {

        if ((firstPoint !== undefined) && (secondPoint !== undefined)) {
            console.log("Im drawing of");
            drawLine();
        }

    }, [firstPoint, secondPoint])


    const drawLine = () => {
        console.log(firstPoint, secondPoint);

        let line = new fabric.Line([firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y], {
            stroke: 'red',
        });

        canvas.add(line);
        canvas.renderAll();

        setFirstPoint(secondPoint);
        setSecondPoint(undefined);
    };

    const addPoint = (e, canvi) => {
        let circle = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 20,
            originX: 'center',
            originY: 'center',
        });

        circle.hasRotatingPoint = true;

        circle.on('mouseout', function () {

            if ((firstPoint !== undefined) && (secondPoint !== undefined)) {
                console.log("Im passing of");
            }
            else if (firstPoint) {
                console.log("I will wait for 2nd point now");
                setSecondPoint({ x: circle.left, y: circle.top });
            } else {
                console.log("I'm still waiting for 1st point", circle.top, circle.left);
                setFirstPoint({ x: circle.left, y: circle.top });
            }

        });

        circle.on('mousedown', function () {
            console.log('down');
            circle.set({
                selectable: true
            });
        });

        circle.on('mouseout', function () {
            console.log('out');
            circle.set({
                selectable: false
            })
        });

        canvi.add(circle);
        canvi.renderAll();
    }

    return (
        <div>
            <h1>Data Annotator</h1>
            <form onSubmit={e => addImg(e, imgURL, canvas)}>
                <div>
                    <input
                        type="file"
                        onChange={e => setImgURL(e.target.files[0])}
                    />
                    <button type="submit">Add Image</button>
                    <button type="button" onClick={e => addPoint(e, canvas)}>Add Circle</button>
                </div>
            </form>
            <canvas id="canvas" />
        </div>
    );
}

export default FabricCanvas;