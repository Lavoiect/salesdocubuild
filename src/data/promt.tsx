import dedent from 'dedent';

const AIPrompt = {
    SALES_DOC_PROMPT : dedent`
    - You can generate document based on following scehma
    - Schema example: [{"content":[{"content":[{"content":{"innerText":"<h1 style=\"text-align: center\">Heading</h1>"},"id":"3703f0fc-79af-45af-9997-53d996c157ec","name":"text","styles":{},"type":"text"}],"id":"93e1d6eb-5852-4574-b83b-95f2ab0dc037","name":"Container","styles":{"backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%"},"type":"container"},{"content":[{"content":{"innerText":"Link test"},"id":"f184d34a-840f-47bd-8dee-c8251aa5d806","name":"Link","styles":{"color":"black","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%","backgroundColor":"white"},"type":"link"}],"id":"20494558-8f10-4bf9-a226-4ddfc55413e2","name":"Container","styles":{"backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%","backgroundColor":"blue"},"type":"container"},{"content":[{"content":{"innerText":"Link test2"},"id":"ed5fa82a-870c-48af-b972-ba70982b0a0e","name":"Link","styles":{"color":"black","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%"},"type":"link"}],"id":"fb0b0a94-06b0-485e-b549-6146429a3114","name":"Container","styles":{"backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%","backgroundColor":"white"},"type":"container"},{"content":[{"content":{"innerText":"<p>test1</p>"},"id":"a4964668-b118-4bf2-a79f-94054cb8ef7b","name":"text","styles":{},"type":"text"}],"id":"88887362-86d2-4e5a-8af8-5582506fe50b","name":"Container","styles":{"backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%","backgroundColor":"white"},"type":"container"},{"content":[{"content":{"innerText":"Text Element"},"id":"8e2acc45-dfc7-4399-9057-0cf51763f7cf","name":"Text","styles":{"color":"black","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%"},"type":"text"}],"id":"0248c5bb-8b4d-4c95-ac51-87cf7e204bc0","name":"Container","styles":{"backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%"},"type":"container"},{"content":[{"content":{"src":"/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F23a72a29-5791-4e97-9608-08f4f46e367b-jmarfk.png&w=3840&q=75\""},"id":"39c0d09b-be04-46e5-9e1a-2b097764762d","name":"Image","styles":{},"type":"image"}],"id":"9574a541-221b-497e-8882-1a71b0aac977","name":"Container","styles":{"backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%"},"type":"container"}],"id":"__body","name":"Body","styles":{"backgroundColor":"green"},"type":"__body"}]
    - Another example: [{"content":[{"content":[],"id":"82306005-b63f-488a-bdf0-faaa282c856a","name":"Container","styles":{"backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%","backgroundImage":"url(https://utfs.io/f/89dcb6e2-c9c5-4b2c-9fcb-e4b290f89e1b-mrfsj9.svg"},"type":"container"}],"id":"__body","name":"Body","styles":{},"type":"__body"}]
    - Add More column, content with type Images, Button, Text, Logo, LogoHeader and other option if needed
    - Use appropriate type when needed, Do not Exactly copy schema as it is , Make changes depends on Email template topic
    - Write Meaning full text content with Emoji icons if needed
    - For logo add image as '/logo.svg' and for image placeholder add '/image.png'
- Give response in JSON format only (Return schema only)

`
    
    
};

export default AIPrompt;

