import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'

const router = express.Router();

dotenv.config();
const token = process.env.ADDRESS_TOKEN;

router.get('/province', async (req, res) => {
    let list = [];
    
    await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        headers: {
            'Content-Type': 'application/json',
            'Token': token
        }
    })
        .then(res => {
            list = res.data.data.map((item) => {
                return {
                    id: item.ProvinceID,
                    name: item.ProvinceName
                }
            });
        })

    list.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    res.json(list);
})

router.get('/district/:provinceID', async (req, res) => {
    const provinceID = Number(req.params.provinceID);
    let list = [];

    await axios.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
        "province_id": provinceID
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Token': token
        }
    })
        .then(res => {
            list = res.data.data.map((item) => {
                return {
                    id: item.DistrictID,
                    name: item.DistrictName
                }
            });
        })

    list.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    res.json(list);
})

router.get('/ward/:districtID', async (req, res) => {
    const districtID = Number(req.params.districtID);
    let list = [];

    await axios.post('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id', {
        "district_id": districtID
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Token': token
        }
    })
        .then(res => {
            list = res.data.data.map((item) => {
                return {
                    id: item.WardID,
                    name: item.WardName
                }
            });
        })

    list.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    res.json(list);
})

export { router };