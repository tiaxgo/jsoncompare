import Navbar from '../../components/Navbar'
import InputPane from '../../components/InputPane'
import OutputPane from '../../components/OutputPane'
import Gutter from '../../components/Gutter'
import ControlsPanel from '../../components/ControlsPanel'
import StatusBar from '../../components/StatusBar'
import Sections from '../../components/Sections'
import UploadModal from '../../components/UploadModal'
import Toast from '../../components/Toast'
import Tooltip from '../../components/Tooltip'

export default function JsonFormatter() {
  return (
    <div className="json-formatter-page">
      <Navbar />

      <main className="layout">
        <div className="panes">
          <InputPane />
          <Gutter />
          <OutputPane />
        </div>

        <ControlsPanel />
        <StatusBar />
        <Sections />
      </main>

      <UploadModal />
      <Toast />
      <Tooltip />
    </div>
  )
}

