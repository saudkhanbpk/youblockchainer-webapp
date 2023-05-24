import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import OptionMap from './OptionMap.json';
import { askGPT } from '../../services/ChatApi';
import { btn } from '../../theme/CssMy';

export default function Chat2() {
    const inputRef = useRef();
    const [msgInputValue, setMsgInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [genre, setGenre] = useState(null);
    const [temporality, setTemporality] = useState(null);
    const [hasPitchIdea, setHasPitchIdea] = useState(null);
    const [enableTF, setEnableTF] = useState(false)
    const [disableTF, setDisableTF] = useState(false)
    const [current, setCurrent] = useState(undefined)

    const topics = [
        'Opening Image',
        'Theme Stated',
        'Setup',
        'Catalyst',
        'Debate',
        'Break Into Two',
        'B Story',
        'Fun and Games',
        'Midpoint',
        'Bad Guys Close In',
        'All is Lost',
        'Dark Night of the Soul',
        'Break Into Three',
        'Finale',
        'Final Image',
    ];

    const initialFire = async (message) => {
        setCurrent('title')

        let template = `Write title, character profiles for a ${contentType} ${genre
            } with temporality as ${temporality}. ${!!message ? `The idea is ${message}.` : ''
            } Also give the outline for this story using the Save the cat story structure.`;
        console.log(template)
        let reply = await askGPT(template);
        console.log(reply);

        await askGPTRecursive(0, template + '\n' + reply);
    }

    const askGPTRecursive = async (index, currentTemplate) => {
        setCurrent(topics[index])
        if (index >= topics.length) {
            return;
        }
        let temp = currentTemplate;
        temp += `\nWrite ${topics[index]} in a screenplay format.`;
        let r = await askGPT(temp);
        if (!!r) {
            temp += '\n' + r;
            console.log(r)
            if (!index) {
                setMessages((prev) => [...prev, {
                    message: r.data,
                    direction: 'incoming'
                }]);
            } else {
                setMessages((prev) => {
                    const updatedArray = [...prev];
                    const lastObjectIndex = updatedArray.length - 1;
                    updatedArray[lastObjectIndex] = { ...updatedArray[lastObjectIndex], message: updatedArray[lastObjectIndex].message + r.data }
                    return updatedArray
                })
            }
        }

        return await askGPTRecursive(index + 1, temp);
    };
    console.log(messages)

    const handleOptionClick = (question, option) => {
        switch (question) {
            case 'Content type ?':
                setContentType(option);
                setMessages([...messages, {
                    message: `Content type ${option}`,
                    direction: 'outgoing'
                }]);
                break;
            case 'Genre ?':
                setGenre(option);
                setMessages([...messages, {
                    message: `Genre ${option}`,
                    direction: 'outgoing'
                }]);
                break;
            case 'Temporality ?':
                setTemporality(option);
                setMessages([...messages, {
                    message: `Temporality ${option}`,
                    direction: 'outgoing'
                }]);
                break;
            case 'Do you have a one minute pitch idea in short ?':
                // setHasPitchIdea(option);
                option === "YES" ? setEnableTF(true) : setHasPitchIdea(false)
                option === "NO" && setDisableTF(true)
                option === "NO" && setMessages((prev) => [...prev, {
                    message: `Do you have a one minute pitch idea in short ? ${option}`,
                    direction: 'outgoing'
                }]
                );
                initialFire(false)
                break;
            default:
                break;
        }
    };

    const renderOptions = (question) => {
        const options = OptionMap[question].options;
        return (
            <div>
                <p style={{ fontSize: '12px', margin: '0', fontWeight: 'bold' }}>{question}</p>
                {options.map((option, index) => (
                    <Button key={index} sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }} onClick={() => handleOptionClick(question, option)}>
                        {option}
                    </Button>
                ))}
            </div>
        );
    };

    console.log(current)


    const handleSend = message => {
        setMessages([...messages, {
            message: `Idea : ${message}`,
            direction: 'outgoing'
        }]);
        setHasPitchIdea(message)
        setMsgInputValue("");
        setDisableTF(true)
        initialFire(message)
        inputRef.current.focus();
    };

    console.log(Object.keys(OptionMap))

    return <>
        <div style={{
            height: "76vh",
        }}>
            <ChatContainer>
                <MessageList scrollBehavior="smooth" typingIndicator={current && <TypingIndicator content={`Generating ${current}`} />} >
                    {messages.map((m, i) => <Message key={i} model={m} />)}
                </MessageList>
            </ChatContainer>
            <div>
                {contentType === null && renderOptions('Content type ?')}
                {contentType && genre === null && renderOptions('Genre ?')}
                {contentType && genre && temporality === null && renderOptions('Temporality ?')}
                {contentType && genre && temporality && !enableTF && hasPitchIdea === null && renderOptions('Do you have a one minute pitch idea in short ?')}
            </div>
            {(enableTF || disableTF) && <MessageInput placeholder="Enter your idea" onSend={handleSend} disabled={disableTF} onChange={setMsgInputValue} value={msgInputValue} ref={inputRef} />}
        </div>
    </>
}

