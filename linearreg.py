#linearregression__1
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import io
import base64

app = FastAPI()

class RegressionReq(BaseModel):
    datax:List[float]
    datay:List[float]
    choice_1:int

@app.post("/plot")
async def get_regression(request: RegressionReq):
    datax = request.datax
    datay = request.datay
    choice_1 = request.choice_1

    if len(datax) != len(datay):
        raise HTTPException(status_code=400, detail="lenth of x and y must be same")
    if len(datax)==0 or len(datay)==0:
        raise HTTPException(status_code=400, detail="data can't be empty")

    output_any=[]
    sumx=0
    sumy=0
    for i in range(len(datax)):
        sumx=sumx+datax[i]
        sumy=sumy+datay[i]

    sumx=sumx/len(datax)
    sumy=sumy/len(datay)
    xy_sum=0
    x_sum=0
    y_sum=0

    for j in range(len(datax)):
        xy_sum=xy_sum+(datax[j]-sumx)*(datay[j]-sumy)
        x_sum=x_sum+(datax[j]-sumx)*(datax[j]-sumx)
        y_sum=y_sum+(datay[j]-sumy)*(datay[j]-sumy)

    xy_sum=xy_sum/len(datax)
    x_sum=x_sum/len(datax)
    y_sum=y_sum/len(datay)

    byx=xy_sum/x_sum
    bxy=xy_sum/y_sum

    fig,ax=plt.subplots()

    if(choice_1==1):
        for e in datax:
            t=byx*e-byx*sumx+sumy
            output_any.append(t)
        ax.plot(datax, output_any, color='blue', label='regression line Y on X')

    elif(choice_1==0):
        for e in datay:
            t=bxy*e-bxy*sumy+sumx
            output_any.append(t)
        ax.plot(output_any, datay, color='blue', label='regression line X on Y')

    else:
        raise HTTPException(status_code=400, detail="enter the correct choice(must choose between 0 and 1)")

    ax.scatter(sumx, sumy, color='green', label='EXPECTATION of the data')
    ax.scatter(datax, datay, color='red', label='data')
    ax.set_xlabel("x")
    ax.set_ylabel("y")
    ax.set_title("linear_reg")
    ax.legend()
    ax.grid(True)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close(fig)

    img_str = base64.b64encode(buf.read()).decode('utf-8')
    return {'img_base64': img_str}


