//user roles
interface Roles {
    USER:string,
    ADMIN:string
}
export const roles:Roles={
    USER:'user',
    ADMIN:"admin"

}
Object.freeze(roles)
//user gender
interface Gender{
    MALE:string,
    FEMALE:string
}
export const gender:Gender={
    MALE:'male',
    FEMALE:'female'
}
Object.freeze(gender)