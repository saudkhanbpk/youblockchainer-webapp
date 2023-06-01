import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar, Button } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import OptionMap from './OptionMap.json';
import { askGPT } from '../../services/ChatApi';
import { btn, ptag } from '../../theme/CssMy';
import moment from 'moment-timezone';
import userImg from '../../images/user.png'
import logo from '../../images/chatbot.png'
import { FountainParser } from "screenplay-js";
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js'
import { updateMe } from '../../services/userServices';
import { uploadImg } from '../../services/ipfsServicesApi';
import shorthash from 'shorthash';


export default function Chat2() {
    const inputRef = useRef();
    const user = JSON.parse(localStorage.getItem('ybUser'))
    const [msgInputValue, setMsgInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [genre, setGenre] = useState(null);
    const [temporality, setTemporality] = useState(null);
    const [hasPitchIdea, setHasPitchIdea] = useState(null);
    const [enableTF, setEnableTF] = useState(false)
    const [disableTF, setDisableTF] = useState(false)
    const [current, setCurrent] = useState(undefined)
    const [finalScript, setFinalScript] = useState('')
    const [generating, setGenerating] = useState(false)
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
        setMessages((prev) => [...prev, {
            message: reply,
            direction: 'incoming',
            mbold: 'Title',
            image: logo,
            time: new Date()
        }])
        let script = await askGPTRecursive(0, template + '\n' + reply, reply);
        setFinalScript(script)
        console.log(script)
        setGenerating(true)
    }

    const askGPTRecursive = async (index, currentTemplate, currScript) => {


        setCurrent(topics[index])
        if (index >= topics.length) {
            return currScript;
        }
        //let temp = currentTemplate;
        let tempScript = currScript;
        //temp += `\nWrite ${topics[index]} in a screenplay format.`;
        let r = await askGPT(
            currentTemplate +
            `\nWrite ${topics[index]} in a screenplay format. The length should be atleast one page`,
        );
        if (!!r) {
            tempScript += '\n' + r;
            console.log(r)
            if (!index) {
                setMessages((prev) => [...prev, {
                    message: r,
                    direction: 'incoming',
                    mbold: topics[index],
                    image: logo,
                    time: new Date()
                }]);
            } else {
                // setMessages((prev) => {
                //     const updatedArray = [...prev];
                //     const lastObjectIndex = updatedArray.length - 1;
                //     updatedArray[lastObjectIndex] = { ...updatedArray[lastObjectIndex], message: updatedArray[lastObjectIndex].message + r }
                //     return updatedArray
                // })
                setMessages((prev) => [...prev, {
                    message: r,
                    direction: 'incoming',
                    mbold: topics[index],
                    image: logo,
                    time: new Date()
                }]);
            }
        }

        return await askGPTRecursive(index + 1, currentTemplate, tempScript);

    };
    console.log(user)

    const handleOptionClick = (question, option) => {
        switch (question) {
            case 'Content type ?':
                setContentType(option);
                setMessages([...messages, {
                    message: `Content type?`,
                    direction: 'incoming',
                    mbold: null,
                    image: logo,
                    time: new Date()
                }, {
                    message: `${option}`,
                    direction: 'outgoing',
                    mbold: null,
                    image: user ? user.profileImage : userImg,
                    time: new Date()
                }]);
                break;
            case 'Genre ?':
                setGenre(option);
                setMessages([...messages, {
                    message: `Genre?`,
                    direction: 'incoming',
                    mbold: null,
                    image: logo,
                    time: new Date()
                }, {
                    message: `${option}`,
                    direction: 'outgoing',
                    mbold: null,
                    image: user ? user.profileImage : userImg,
                    time: new Date()
                }]);
                break;
            case 'Temporality ?':
                setTemporality(option);
                setMessages([...messages, {
                    message: `Temporality ?`,
                    direction: 'incoming',
                    mbold: null,
                    image: logo,
                    time: new Date()
                }, {
                    message: `${option}`,
                    direction: 'outgoing',
                    mbold: null,
                    image: user ? user.profileImage : userImg,
                    time: new Date()
                }]);
                break;
            case 'Do you have a one minute pitch idea in short ?':
                // setHasPitchIdea(option);
                option === "YES" ? setEnableTF(true) : setHasPitchIdea(false)
                option === "NO" && setDisableTF(true)
                option === "NO" && setMessages((prev) => [...prev, {
                    message: `Do you have a one minute pitch idea in short ?`,
                    direction: 'incoming',
                    mbold: null,
                    image: logo,
                    time: new Date()
                }, {
                    message: `${option}`,
                    direction: 'outgoing',
                    mbold: null,
                    image: user ? user.profileImage : userImg,
                    time: new Date()
                }]
                );
                option === "NO" && initialFire(false)
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
            message: `Idea`,
            direction: 'incoming',
            mbold: null,
            image: logo,
            time: new Date()
        }, {
            message: `${message}`,
            direction: 'outgoing',
            mbold: null,
            image: user ? user.profileImage : userImg,
            time: new Date()
        }]);
        setHasPitchIdea(message)
        setMsgInputValue("");
        setEnableTF(false)

        setDisableTF(true)
        initialFire(message)
        inputRef.current.focus();
    };

    const saveAndDownload = async () => {
        console.log('here', FountainParser);
        let options = {
            paginate: true,
            tokens: true,
        };

        const screenplay = FountainParser.parse(
            finalScript,
            options,
        );
        console.log(screenplay)
        const opt = {
            margin: 1,
            filename: 'myfile.pdf',
            image: { type: 'pdf', quality: 0.99 }, // Use 'jpeg' instead of 'text' for the image type
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        let html =
            screenplay.title_page_html +
            screenplay.script_pages.map(i => i.html).join('');
        html2pdf(html, opt)
        // let urls = await uploadImg([
        //     {
        //         uri: 'file://' + file.filePath,
        //         type: 'application/pdf',
        //         name: `Script_${shorthash.unique(html)}`,
        //     },
        // ]);
        // await updateMe(
        //     {
        //         scripts: [...user?.scripts, urls[0]],
        //     }
        // );

        // console.log(html)

        // const doc = new jsPDF();

        // screenplay.script_pages.forEach((pageData, index) => {
        //     if (index !== 0) {
        //         doc.addPage();
        //     }

        //     doc.html(screenplay.scenes[index], 10, 10);
        //     doc.html(pageData.html, 10, 20);
        // });

        // doc.html(html, {
        //     callback: function (doc) {
        //         doc.save("output.pdf");
        //     }, x: 10, y: 10
        // });
        // doc.save("script.pdf");
        // await saveAsPdf(html, inDevice, user.scripts || [], setUser);

    }

    console.log(Object.keys(OptionMap))

    return <>
        <div style={{
            height: "76vh",
        }}>
            <ChatContainer >
                <MessageList style={{ paddingBottom: '3%' }} scrollBehavior="smooth" typingIndicator={current && <TypingIndicator style={{ backgroundColor: 'transparent' }} content={`Generating ${current}`} />} >
                    {messages.map((m, i) => <div style={{ display: 'flex' }}>
                        {m.direction === 'incoming' && <Avatar src={m.image} style={{ width: '30px', height: '30px', marginRight: '1%', marginTop: '2%' }} />}
                        <Message key={i} model={m}  >
                            <Message.CustomContent >
                                {m.mbold && <strong>{m.mbold}</strong>}
                                {m.mbold && <br />}
                                {m.message}
                                {m.direction === 'outgoing' ? <p style={{ textAlign: 'right', ...ptag, fontSize: '8px' }}>{moment(m.time).format('hh:mm A')}</p> : <p style={{ textAlign: 'left', ...ptag, fontSize: '8px' }}>{moment(m.time).format('hh:mm A')}</p>}
                            </Message.CustomContent>
                        </Message>
                        {m.direction === 'outgoing' && <Avatar src={m.image} style={{ width: '30px', height: '30px', marginLeft: '1%', marginTop: '2%' }} />}
                    </div>)}
                </MessageList>
            </ChatContainer>
            <div>
                {contentType === null && renderOptions('Content type ?')}
                {contentType && genre === null && renderOptions('Genre ?')}
                {contentType && genre && temporality === null && renderOptions('Temporality ?')}
                {contentType && genre && temporality && !enableTF && hasPitchIdea === null && renderOptions('Do you have a one minute pitch idea in short ?')}
            </div>
            {
                generating && <>
                    <Button sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }} onClick={() => saveAndDownload()}>
                        Save and download
                    </Button>
                    <Button sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }} onClick={() => saveAndDownload()}>
                        Save
                    </Button>
                    <Button sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }} onClick={() => {
                        setGenerating(false)
                        setContentType(null)
                        setGenre(null)
                        setTemporality(null)
                        setHasPitchIdea(null)
                    }}>
                        Regenerate Script
                    </Button>
                </>

            }
            {(enableTF || disableTF) && !generating && <MessageInput placeholder="Enter your idea" disabled={disableTF} onSend={handleSend} onChange={setMsgInputValue} value={msgInputValue} ref={inputRef} />}
        </div>
    </>
}

