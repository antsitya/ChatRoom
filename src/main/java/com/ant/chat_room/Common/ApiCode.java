package com.ant.chat_room.Common;

public enum  ApiCode {
    SUUCESS_CODE(200),
    EXCEPTION_CODE(99),
    EMPTY_ERROR_CODE(401),
    HTTP_ERROR_CODE(407),
    PARAMETER_ERROR_CODE(402),
    SERVER_ERROR_CODE(400);
    private int value;
    ApiCode(int value){this.value=value;}
    public int value(){
        return this.value;
    }
}
