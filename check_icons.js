const i = require('@element-plus/icons-vue')
const names = ['Order','BankCard','Document','CircleCheck','Back','CircleClose','Picture','Warning','ArrowRight','ArrowLeft','Plus','Refrigerator','Truck','Finished','Van']
names.forEach(n => console.log(n, !!i[n]))
