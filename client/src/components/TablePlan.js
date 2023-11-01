import React, { useState, useEffect, useRef, useContext } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Transformer } from 'react-konva';
import DefaultTemplate from '../components/DefaultTemplate';
import { message, Button } from 'antd';
import { fetchTables } from '../redux/store';
import { useDispatch } from 'react-redux';  
import { UserContext } from '../UserContext';
import '../style/TablePlan.css';

function TablePlan() {
    const dispatch = useDispatch();  

    const [tables, setTables] = useState([]);
    const [selectedShape, setSelectedShape] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [barriers, setBarriers] = useState([]);
    const [selectedBarrier, setSelectedBarrier] = useState(null);
    const transformerRef = useRef(null);
    const [scale, setScale] = useState(1);  // Starting zoom level at 1 (no zoom)
    const stageWidth = 1000;
    const stageHeight = 600;
    const minScale = 0.5; 
    const maxScale = 2;   
    const { currentUser, checkPermission } = useContext(UserContext);
    const [isEditMode, setIsEditMode] = useState(false);

    const [position, setPosition] = useState({
        x: (window.innerWidth - stageWidth) / 2,
        y: (window.innerHeight - stageHeight) / 2
    });


    


    useEffect(() => {
        fetch("/api/table-plans")
            .then(res => res.json())
            .then(data => setTables(data.tables));
    }, []);

    useEffect(() => {
    dispatch(fetchTables());
}, [dispatch]);

    

    const handleAddTable = (e) => {
        if (selectedShape === 'barrier') {
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const newBarrier = { x: mousePos.x, y: mousePos.y, width: 150, height: 100 };
            setBarriers([...barriers, newBarrier]);
            setSelectedShape(null);
        } else if (selectedShape) {
            const stage = e.target.getStage();
            const mousePos = stage.getPointerPosition();
            const newTable = {
                shape: selectedShape,
                coordinates: [mousePos.x, mousePos.y],
                tableNumber: tables.length + 1
            };
            setTables([...tables, newTable]);
        }
    };

    const handleWheel = (e) => {
        e.evt.preventDefault();
    
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        
    
        const pointerPos = stage.getPointerPosition();
        const newScale = e.evt.deltaY > 0 
        ? Math.max(oldScale / scaleBy, minScale) 
        : Math.min(oldScale * scaleBy, maxScale);
    
        setPosition({
            x: pointerPos.x - (pointerPos.x - position.x) * newScale / oldScale,
            y: pointerPos.y - (pointerPos.y - position.y) * newScale / oldScale,
        });
    
        setScale(newScale);
    };

    const handleDragMove = (e) => {
        setPosition({
            x: e.target.x(),
            y: e.target.y(),
        });
    };
    
    

    // Handle removing barrier
    const handleDeleteBarrier = () => {
        if (selectedBarrier) {
            const updatedBarriers = barriers.filter(barrier => barrier !== selectedBarrier);
            setBarriers(updatedBarriers);
            setSelectedBarrier(null);
        }
    };
    
    const handleDeleteTable = () => {
        if (selectedTable) {
            const updatedTables = tables.filter(table => table.tableNumber !== selectedTable.tableNumber);
            setTables(updatedTables);
            setSelectedTable(null);
        }
    };

    const handleEditTableNumber = (table) => {
        const newTableNumber = prompt('Enter new table number:', table.tableNumber);
        if (newTableNumber) {
            const updatedTables = tables.map(t => {
                if (t.tableNumber === table.tableNumber) {
                    t.tableNumber = parseInt(newTableNumber, 10);
                }
                return t;
            });
            setTables(updatedTables);
        }
    };

    const handleEditText = (barrier) => {
        const newText = prompt('Enter new text for the barrier:', barrier.text || "Barrier Text");
        if (newText) {
            const updatedBarriers = barriers.map(b => {
                if (b === barrier) {
                    b.text = newText;
                }
                return b;
            });
            setBarriers(updatedBarriers);
        }
    };
    

    const saveTablePlan = () => {
        fetch("/api/table-plans", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tables, barriers }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setTables(data.tables);
                setBarriers(data.barriers);
                message.success('Table Plan saved successfully!');

            } else {
               
            }
        });

    };

   



    return (
        <DefaultTemplate>
            <div className="table-plan-container">
            <div className="stage-controls">
   {currentUser && checkPermission('canEdit') && (
     <>
       <Button type="primary" onClick={() => setIsEditMode(!isEditMode)}>Toggle Edit Mode</Button>
       {isEditMode && (
         <>
           <Button type="primary" onClick={() => setSelectedShape('rectangle')}>Rectangle Table</Button>
           <Button type="primary" onClick={() => setSelectedShape('circle')}>Round Table</Button>
           <Button type="primary" onClick={() => setSelectedShape('barrier')}>Add Barrier</Button>
           <Button type="primary" onClick={saveTablePlan}>Save</Button>
           {selectedTable && <Button type="primary" onClick={handleDeleteTable}>Delete Selected Table</Button>}
           {selectedBarrier && <Button type="primary" onClick={handleDeleteBarrier}>Delete Selected Barrier</Button>}
         </>
       )}
     </>
   )}
</div>

                
                <div className="stage-container">
                    <Stage 
                        width={stageWidth}
                        height={stageHeight}
                        onWheel={handleWheel}
                        scaleX={scale}
                        scaleY={scale}
                        x={position.x}
                        y={position.y}
                        onClick={handleAddTable}>
                        <Layer>
                        <Rect x={0} y={0} width={stageWidth} height={stageHeight} />

                            
                            {barriers.map((barrier, index) => (
                                <Group key={index} draggable={isEditMode} onClick={(e) => {
                                    setSelectedBarrier(barrier);
                                    if (transformerRef.current) {
                                        transformerRef.current.nodes([e.target]);
                                        transformerRef.current.getLayer().batchDraw();
                                    }
                                    e.cancelBubble = true;
                                }}>
                                     <Rect 
                                        x={barrier.x} 
                                        y={barrier.y} 
                                        width={barrier.width} 
                                        height={barrier.height} 
                                        fill="darkgray" 
                                        className="barrier"
                                    />
                                    <Text 
                                        x={barrier.x + 10} 
                                        y={barrier.y + 10}
                                        text={barrier.text || "Barrier Text"}
                                        fontSize={14}
                                        className="barrier-text"
                                        onDblClick={() => handleEditText(barrier)}
                                    />
                                </Group>
                            ))}
                            
                            {tables.map((table, index) => {
                                if (table.shape === 'rectangle') {
                                    return (
                                        <Group key={index} draggable={isEditMode} onClick={(e) => {
                                            setSelectedTable(table);
                                            if (transformerRef.current) {
                                                transformerRef.current.nodes([e.target]);
                                                transformerRef.current.getLayer().batchDraw();
                                            }
                                            e.cancelBubble = true;
                                        }}>
                                            <Rect 
                                                x={table.coordinates[0]} 
                                                y={table.coordinates[1]} 
                                                width={100} 
                                                height={50} 
                                                fill="lightgray" 
                                                stroke="black"
                                                className="rectangle-table"
                                            />
                                            <Text
                                                x={table.coordinates[0] + 30}
                                                y={table.coordinates[1] + 15}
                                                text={table.tableNumber.toString()}
                                                onDblClick={() => handleEditTableNumber(table)}
                                                fontSize={14}
                                                className="table-number-text"
                                            />
                                        </Group>
                                    );
                                } else if (table.shape === 'circle') {
                                    return (
                                        <Group key={index} draggable={isEditMode} onClick={(e) => {
                                            setSelectedTable(table);
                                            e.cancelBubble = true;
                                        }}>
                                            <Circle 
                                                x={table.coordinates[0]} 
                                                y={table.coordinates[1]} 
                                                radius={50} 
                                                fill="lightgray" 
                                                stroke="black"
                                                className="round-table"
                                            />
                                            <Text
                                                x={table.coordinates[0] - 10}
                                                y={table.coordinates[1] - 7}
                                                text={table.tableNumber.toString()}
                                                fontSize={14}
                                                className="table-number-text"
                                            />
                                        </Group>
                                    );
                                }
                                return null;
                            })}
                            <Transformer 
                                ref={transformerRef} 
                                enabledAnchors={isEditMode ? ['top-left', 'top-right', 'bottom-left', 'bottom-right'] : []} 
                                boundBoxFunc={(oldBox, newBox) => {
                                    if (newBox.width < 50 || newBox.height < 50) {
                                        return oldBox;
                                    }
                                    return newBox;
                                }} 
                            />
                        </Layer>
                    </Stage>
                </div>
            </div>
        </DefaultTemplate>
    );
}

export default TablePlan;
