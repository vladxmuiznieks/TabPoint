import React from 'react';
import { Card, Button } from 'antd';
import { Draggable } from 'react-beautiful-dnd';

const CategoryCard = ({ categoryName, index }) => {
  return (
    <Draggable draggableId={`category-${categoryName}`} index={index} type="CATEGORY">
      {(provided) => (
        <div {...provided.draggableProps} ref={provided.innerRef}>
          <Card
            title={categoryName}
          >
            <Button onClick={() => {/*rename modal */}}>Rename</Button>
          </Card>
          <div {...provided.dragHandleProps}></div>
        </div>
      )}
    </Draggable>
  );
};

export default CategoryCard;
