export const source = `
type MyPrimitiveType = string

type MyRecord = {
  name: str,
  age: int,
}

type MyTuple = [int, str, Person]

type MyEnum = Option1 | Option2 | Option3

type MyAdt = 
    | ValueA(string)
    | ValueB({width: number, height: number})
    | ValueD
`

export const compiled = `
`