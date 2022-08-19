<template>
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      action="#"
      :http-request="onRequest"
      :file-list="fileList"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :before-upload="beforeUpload"
      :limit="1"
      list-type="picture-card"
      class="custom-upload"
      :class="fileList.length === 1 ? 'hideAdd' : ''"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog title="图片预览" :visible.sync="previewImgDialog">
      <img style="width: 100%" :src="previewImgUrl" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDVn4EAqHTQ8bpoY3II4qOiphKirlQpzua',
  SecretKey: 'VmobAUZPzKQHsHUSBgwylLgnfIgpjOq3'
})
// console.log(cos)
export default {
  name: 'UploadImg',
  data() {
    return {
      fileList: [],
      previewImgDialog: false,
      loading: false,
      previewImgUrl: ''
    }
  },

  created() {},

  methods: {
    onRequest({ file }) {
      this.loading = true
      cos.putObject(
        {
          Bucket: 'xiaowu-1313341683' /* 填入您自己的存储桶，必须字段 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key: file.name /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          this.loading = false
          if (!err && data.statusCode === 200) {
            this.$emit('onSuccess', {
              url: 'https://' + data.Location
            })
          }
        }
      )
    },
    // 文件状态发生变化
    onChange(file, fileList) {
      console.log('上传图片', file, fileList)
      this.fileList = fileList
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    onPreview(file) {
      this.previewImgDialog = true
      this.previewImgUrl = file.url
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 2 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过2M')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.hideAdd .el-upload--picture-card {
  display: none;
}
.custom-upload {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
