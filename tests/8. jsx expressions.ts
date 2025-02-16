export const source = `
let x = <div className="yo" id={4 + 5}>
    hi
</div>
let y = <div className="yo" id={4 + 5} />
let z = <div className="yo" id={4 + 5}>
    <h1>yo</h1>
    <h2>yo</h2>
    {4 + 5}
    string
</div>
`

export const compiled = `
let x = <div className="yo" id={4+5}>hi</div>;
let y = <div className="yo" id={4+5} />;
let z = <div className="yo" id={4+5}><h1>yo</h1><h2>yo</h2>{4 + 5}string</div>;
`