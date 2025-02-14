 update_banner = async(req,res) => {
        const {bannerId} = req.params

        const form = formidable({})

        form.parse(req, async(err,_,files) => {
            const {mainban} = files
            
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })

            try {
                let banner = await bannerModel.findById(bannerId)
                let temp = banner.banner.split('/')
                temp = temp[temp.length - 1]
                const imageName = temp.split('.')[0]
                console.log(`image name is : ${imageName}`)
                await cloudinary.uploader.destroy(imageName)

                const {url} = await cloudinary.uploader.upload(mainban.filepath, {folder: 'banners'})
                await bannerModel.findByIdAndUpdate(bannerId, {
                    banner : url
                })

                banner = await bannerModel.findById(bannerId)
                responseReturn(res, 200, {banner, message: "Banner Update Success"})


            } catch (error) {
                responseReturn(res, 500, {error : error.message})
            }

        })

       
    }