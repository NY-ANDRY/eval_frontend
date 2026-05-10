

const DangerousHTML = () => {

    const dangerousHtml = `
        <div>I am dangerous</div>
    `;

    return (
        <div className="flex" dangerouslySetInnerHTML={{ __html: dangerousHtml }}></div>
    )
}

export default DangerousHTML;