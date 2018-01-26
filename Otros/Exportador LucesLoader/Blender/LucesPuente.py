import bpy, json

bl_info = {
    "name": "Luces Puente",
    "category": "Object",
	"author": "Surruit",
    "version": (1, 0)
}

class ExportarLucesPuente(bpy.types.Operator):
    """Exporta las luces seleccionadas a un formato de archivo para el framework Puente"""
    bl_idname = "object.luces"
    bl_label = "Exportar luces Puente (portapapeles)"
    bl_options = {'REGISTER', 'UNDO'}
    
    #angle_limit = bpy.props.IntProperty(name="Angle Limit", default=100, min=1, max=180)

    @classmethod
    def poll(cls, context):
        return context.active_object is not None

    def execute(self, context):
        luces = []
        data = {}
        for ob in context.selected_objects:
            if (ob.type == 'LAMP'):
                luces.append(ob)
                
        for lamp in luces:
            luz = self.getLuzAsJSON(lamp)
            if (luz is not None):
                data[len(data)] = luz
        
        if (bpy.data.worlds[0].light_settings.use_environment_light):
            data[len(data)] = self.getAmbientLight()
            
        #data ya contiene todas las luces en formado similar a javascript.
        #print (data[0]["propiedades"])
        dataJSON = json.dumps(data, indent = 2)
        
        bpy.context.window_manager.clipboard =dataJSON
            
        return {'FINISHED'}
    
    def invoke(self, context, event):
        wm = context.window_manager
        return wm.invoke_props_dialog(self)
    
    def getLuzAsJSON(self, ob):
        #filtros para parametros no soportados:
        if (ob.data.type == 'SUN'): return 
        if (ob.data.type == 'HEMI'): return 
        if (ob.data.type == 'AREA'): return 
    
    
        luz = {}
        luz["nombre"] = ob.name
        luz["tipo"] = ob.data.type
        
        if (ob.data.type == 'POINT'): luz["propiedades"] = self.pointPropiedades(ob)
        if (ob.data.type == 'SPOT'): luz["propiedades"] = self.spotPropiedades(ob)
        
        return luz
    
    def pointPropiedades(self, ob):
        prop = {}
        
		#Blender usa Z para indicar arriba, Threejs usa Y, intercambiamos los valores antes de exportarlo.
		#Ademas, en Threejs la profundidad funciona al reves (en Blender valores positivos es hacia dentro de la pantalla, en Threejs valores positivos es hacia fuera de la pantalla), asi que invertimos el valor.
        l = ob.location
        prop["posicion"] = [l.x, l.z, l.y*(-1)]
        
        #rotacion
        if (ob.rotation_mode != 'QUATERNION'): #fuerza a computar los datos del quaternion
            mode = ob.rotation_mode
            ob.rotation_mode = 'QUATERNION'
            ob.rotation_mode = mode;
        r = ob.rotation_quaternion
        prop["rotacion"] = [r.x, r.z, -r.y, r.w]
        
        c = ob.data.color
        prop["color"] = [c.r, c.g, c.b] #Formato lista RGB de rango 0-1
        prop["energia"] = ob.data.energy
        prop["distancia"] = ob.data.distance*2 #en Blender la distancia es el punto en el que la potencia de la luz vale la mitad, en Threejs es el punto en el que vale 0
        
        return prop
    
    def spotPropiedades(self, ob):
        prop = {}
        
		#Blender usa Z para indicar arriba, Threejs usa Y, intercambiamos los valores antes de exportarlo.
		#Ademas, en Threejs la profundidad funciona al reves (en Blender valores positivos es hacia dentro de la pantalla, en Threejs valores positivos es hacia fuera de la pantalla), asi que invertimos el valor.
        l = ob.location
        prop["posicion"] = [l.x, l.z, l.y*(-1)]
		
        #rotacion
        if (ob.rotation_mode != 'QUATERNION'): #fuerza a computar los datos del quaternion
            mode = ob.rotation_mode
            ob.rotation_mode = 'QUATERNION'
            ob.rotation_mode = mode;
        r = ob.rotation_quaternion
		#convierte el sistema de coordenadas quaterniano de Blender al de Threejs.
		#mas info: https://stackoverflow.com/questions/18818102/convert-quaternion-representing-rotation-from-one-coordinate-system-to-another
        prop["rotacion"] = [r.x, r.z, -r.y, r.w]
        
        c = ob.data.color
        prop["color"] = [c.r, c.g, c.b] #Formato lista RGB de rango 0-1
        prop["energia"] = ob.data.energy
        prop["distancia"] = ob.data.distance*2 #en Blender la distancia es el punto en el que la potencia de la luz vale la mitad, en Threejs es el punto en el que vale 0
        prop["angulo"] = ob.data.spot_size/2 #en radianes, Threejs usa otra escala, la mitad de tamaño.
        prop["penumbra"] = ob.data.spot_blend
        
        return prop
    
    
    def getAmbientLight(self):
        luz = {}
        luz["nombre"] = "LuzAmbiental"
        luz["tipo"] = 'AMBIENT'
        luz["propiedades"] = prop = {}
        
        prop["color"] = (1.0, 1.0, 1.0)
        prop["energia"] = bpy.data.worlds[0].light_settings.environment_energy
        
        return luz
        
        
def register():
    bpy.utils.register_class(ExportarLucesPuente)


def unregister():
    bpy.utils.unregister_class(ExportarLucesPuente)


if __name__ == "__main__":
    register()
