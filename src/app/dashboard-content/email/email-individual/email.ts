export interface Email{
    documentNumber:number;
    subject:string;
    dateOfLetter:Date;
    type:number;
    attention:string;
    through:string;
    from:string;
    pageCount:number;
    attachment:string;
    campus:number;
    cc:string[];
    encoder:number;
    message:string;
    departmentId:number;
}