import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolder,
  faFile,
  faChevronRight,
  faChevronDown,
  faEdit,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import './App.css';

const File = ({ name, onEdit, onDelete }) => (
  <div className="file">
    <FontAwesomeIcon icon={faFile} className="icon file-icon" />
    <span className="file-name">{name}</span>
    <div className="file-actions">
      <FontAwesomeIcon icon={faEdit} className="action-icon edit-icon" onClick={() => onEdit(name)} />
      <FontAwesomeIcon icon={faTrash} className="action-icon delete-icon" onClick={() => onDelete(name)} />
    </div>
  </div>
);

const Node = ({ node, depth = 0, onEdit, onDelete, onCreate }) => {
  if (typeof node === 'string') {
    return <File name={node} onEdit={onEdit} onDelete={onDelete} />;
  } else {
    const isDownloadsFolder = node.name === 'Downloads';
    const isChromedriver = typeof node === 'string' && node === 'chromedriver.dmg';

    if (isChromedriver) {
      return <File name={node} onEdit={onEdit} onDelete={onDelete} />;
    } else {
      return (
        <Folder
          folder={node}
          depth={depth}
          onEdit={onEdit}
          onDelete={onDelete}
          onCreate={onCreate}
          isDownloadsFolder={isDownloadsFolder}
        />
      );
    }
  }
};

const Folder = ({ folder, depth, onEdit, onDelete, onCreate, isDownloadsFolder, isChromedriver }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCreate = () => {
    const newItemName = prompt('Enter new item name:');
    if (newItemName) {
      onCreate(folder, newItemName);
    }
  };

  return (
    <div className="folder" style={{ marginLeft: `${depth * 20}px` }}>
      <div onClick={handleToggle} className="folder-header">
        <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} className="icon toggle-icon" />
        <FontAwesomeIcon icon={faFolder} className="icon folder-icon" />
        <span className="folder-name">{folder.name}</span>
        <div className="folder-actions">
          <FontAwesomeIcon icon={faEdit} className="action-icon edit-icon" onClick={() => onEdit(folder)} />
          <FontAwesomeIcon icon={faTrash} className="action-icon delete-icon" onClick={() => onDelete(folder)} />
          <FontAwesomeIcon icon={faPlus} className="action-icon add-icon" onClick={handleCreate} />
        </div>
      </div>
      {isOpen && (
        <div className="folder-content">
          {folder.children &&
            folder.children.map((item, index) => (
              <Node
                key={index}
                node={item}
                depth={depth + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onCreate={onCreate}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const Explorer = () => {
  const [jsonData, setJsonData] = useState({
    name: 'Root',
    children: [
      {
        name: 'Documents',
        children: ['Document1.jpg', 'Document2.jpg', 'Document3.jpg'],
      },
      {
        name: 'Desktop',
        children: ['Screenshot1.jpg', 'videopal.mp4'],
      },
      {
        name: 'Downloads',
        children: [
          {
            name: 'Drivers',
            children: ['Printerdriver.dmg', 'cameradriver.dmg'],
          },
          
        ],
      },
      {
        name: 'Applications',
        children: ['Webstorm.dmg', 'Pycharm.dmg', 'FileZila.dmg', 'Mattermost.dmg'],
      },
      'chromedriver.dmg',
    ],
  });

  const handleEdit = (item) => {
    const newName = prompt(`Enter new name for ${item.name}:`);
    if (newName) {
      setJsonData((prevData) => updateItem(prevData, item, newName));
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      setJsonData((prevData) => deleteItem(prevData, item));
    }
  };

  const handleCreate = (parentFolder, newItemName) => {
    setJsonData((prevData) => addItem(prevData, parentFolder, newItemName));
  };

  const updateItem = (data, item, newName) => {
    const recursiveUpdate = (currentItem) => {
      if (currentItem === item) {
        return { ...currentItem, name: newName };
      } else if (typeof currentItem !== 'string' && currentItem.children) {
        return { ...currentItem, children: currentItem.children.map(recursiveUpdate) };
      } else {
        return currentItem;
      }
    };

    return {
      ...data,
      children: data.children.map(recursiveUpdate),
    };
  };

  const deleteItem = (data, item) => {
    const recursiveDelete = (currentItem) => {
      if (currentItem === item) {
        return null; // Remove the item
      } else if (typeof currentItem !== 'string' && currentItem.children) {
        return { ...currentItem, children: currentItem.children.map(recursiveDelete) };
      } else {
        return currentItem;
      }
    };

    return {
      ...data,
      children: data.children.map(recursiveDelete).filter(Boolean), // Filter out null values (removed items)
    };
  };

  const addItem = (data, parentFolder, newItemName) => {
    const recursiveAdd = (currentItem) => {
      if (currentItem === parentFolder) {
        return {
          ...currentItem,
          children: [...(currentItem.children || []), { name: newItemName, children: [] }],
        };
      } else if (typeof currentItem !== 'string' && currentItem.children) {
        return {
          ...currentItem,
          children: currentItem.children.map(recursiveAdd),
        };
      } else {
        return currentItem;
      }
    };

    return {
      ...data,
      children: data.children.map(recursiveAdd),
    };
  };

  return (
    <div className="explorer-container">
      <div className="explorer">
        <Node node={jsonData} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} />
      </div>
    </div>
  );
};

export default Explorer;
