
interface props {
    [key: string]: any,
    props: {
        serializedData : {
            [key: string] : any
        },
        [key : string] : any
    }
}
interface book {
    name : string,
    price : string,
    image : any, 
    genre : String[],
    description: string,
}


const GenreBooks = (props : props)  => {
    console.log(props.props.serializedData)
    const books = props.props.serializedData.map((value : any) => {
        return value.books
    });
    console.log(books)
    return (
        <>
        <div>
            {books.map((value: book, index: number) => {
                return (                
                <div key ={index}>
                    <p></p>
                </div> 
                )
            })}   
        </div>
        </>
    )
}

export default GenreBooks