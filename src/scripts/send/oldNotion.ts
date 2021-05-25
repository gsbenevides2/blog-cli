/*
const filePath = path.resolve(process.cwd(), 'notion.zip')

function downloadNotionZip(): Promise<void> {
		return new Promise<void>(resolve => {
				const url = readlineSync.question('Qual é o link do nottion?\n ')
				if (!url) log.error('Informe um link valido!')
				log.info('Baixando post do Notion')
				const file = fs.createWriteStream(filePath)
				const request = https.get(url, response => {
						response.pipe(file)
						file.on('finish', () => {
								file.close()
								resolve()
						})
				})
				request.on('error', () => {
						fs.unlinkSync(filePath)
						log.error('Não foi possivel baixar o arquivo do Notion')
				})
		})
}

function uncompressNotionZip(): Promise<void> {
		log.info('Descomprindo post')
		return new Promise<void>(resolve => {
				fs.createReadStream(filePath)
						.pipe(unzipper.Extract({ path: paths.postFolder }))
						.on('close', () => {
								fs.unlinkSync(filePath)
								resolve()
						})
		})
}

function normalizeUncompressedPost() {
		log.info('Tratando arquivos recebidos no Notion')
		const folderAssentsName = fs
				.readdirSync(paths.postFolder, {
						withFileTypes: true
				})
				.filter(dir => !dir.isFile())[0].name
		const pathOfContentFile = path.resolve(
				paths.postFolder,
				`${folderAssentsName}.md`
		)
		const folderAssentPath = path.resolve(paths.postFolder, folderAssentsName)
		const oldThumbnailPath = path.resolve(paths.assentsFolder, 'thumbnail.png')

		const contentFile = fs.readFileSync(pathOfContentFile).toString()
		const newContentFile = contentFile
				.split(encodeURI(folderAssentsName))
				.join('/assents')
				.split('\n')
		.filter((value, line, lines) => {
		*/
// const regex = /(Etapas)|(Situação):.*/gm
/*  const firstLines = [3, 4]
		if (regex.exec(value) !== null) return false
		else if (value === '' && line !== 2 && firstLines.includes(line)) {
				return false
		} else if (line === lines.length - 1) return false
		else return true
})
.join('\n')

fs.mkdirSync(paths.thumbnailFolder)
fs.writeFileSync(paths.contentFile, newContentFile)
fs.unlinkSync(pathOfContentFile)

fs.renameSync(folderAssentPath, paths.assentsFolder)
fs.renameSync(oldThumbnailPath, paths.thumbnailFile.originalPng)
}

export async function downloadPostFromNotion(): Promise<void> {
clearPostFolder()
await downloadNotionZip()
await uncompressNotionZip()
normalizeUncompressedPost()
}

function clearPostFolder(): void {
if (fs.existsSync(paths.postFolder)) {
rimraf.sync(paths.postFolder)
}
}
*/
