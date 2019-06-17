<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct()
    {
      //  $this->middleware('auth:admin');
    }

    public function CategorieCreation(Request $request)
    {;
		$idCategorie = $request->input('idCategorie');
		$nom = $request->input('nom');
		$matiere = $request->input('matiere');
		$niveau = $request->input('niveau');
		$estPublic = $request->input('estPublic');
		
		$idMaitresseCreatrice = 1;//////////////////////////////////////ASSOCIATION fiche avec ADMIN
		
		if (!$request->has(['idCategorie', 'nom', 'matiere', 'niveau', 'estPublic']))
			return response()->json(["code" => "400", "message" => "Missing Parameter"], 400);
		
		if (!$request->filled(['idCategorie', 'nom', 'matiere', 'niveau', 'estPublic']))
			return response()->json(["code" => "400", "message" => "Unfilled Parameter"], 400);
		
		DB::insert('
			INSERT INTO `categorie`
			(`idCategorie`, `nom`, `matiere`, `niveau`, `estPublic`, `idMaitresseCreatrice`) 
			VALUES (?,?,?,?,?,?)', [$idCategorie, $nom, $matiere, $niveau, $estPublic, $idMaitresseCreatrice]);
			
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function CategorieDelete(Request $request, $idCategorie)
    {
		//////////////////////////////////////SELON OWNERSHIP LADMIN
		$idMaitresseCreatrice = 1;
		
		if (!IsValidID($idCategorie))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$result = DB::delete('DELETE FROM `categorie` WHERE `idCategorie` =? AND `idMaitresseCreatrice` =?', [$idFiche, $idMaitresseCreatrice]);
		
		if ($result == 0) 
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function CategorieGet(Request $request, $idCategorie)
    {
		//////////////////////////////////////SELON OWNERSHIP LADMIN
		$idMaitresseCreatrice = 1;
		
        if (!IsValidID($idCategorie))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
         
         
        $result = DB::select('
            SELECT * FROM `categorie`
            WHERE (`idCategorie` = ?) AND
			(`estPublic` = 1 OR `idMaitresseCreatrice` =?)',
            [$idCategorie, $idMaitresseCreatrice]);
         
        if ($result == null) 
        {
            return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
        }
        
        return response()->json($result[0], 200);
    }
    
    public function CategorieGetList(Request $request, $page = 1)
    {
        //////////////////////////////////////SELON LADMIN
		$idMaitresseCreatrice = 1;
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('
			SELECT * FROM `categorie` 
			WHERE `estPublic` = 1 OR `idMaitresseCreatrice` =? 
			LIMIT ?,30',[$idMaitresseCreatrice, ($page * 30) - 30]), 200);

    }

    public function FicheCreation(Request $request)
    {
		$idFiche = $request->input('idFiche');
		$idCategorie = $request->input('idCategorie');
		$titre = $request->input('titre');
		
		$listeQuestion = $request->input('listeQuestion');
		
		$idMaitresseCreatrice = 1;//////////////////////////////////////ASSOCIATION fiche avec ADMIN
		
		if (!$request->has(['idFiche', 'idCategorie', 'titre', 'listeQuestion']))
			return response()->json(["code" => "400", "message" => "Missing Parameter"], 400);
		
		if (!$request->filled(['idFiche', 'idCategorie', 'titre', 'listeQuestion']))
			return response()->json(["code" => "400", "message" => "Unfilled Parameter"], 400);
		
		DB::insert('
			INSERT INTO `fiche`
			(`idFiche`, `idCategorie`, `titre`, `idMaitresseCreatrice`) 
			VALUES (?,?,?,?)', [$idFiche, $idCategorie, $titre, $idMaitresseCreatrice]);
			
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Liste des questions...
			
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function FicheDelete(Request $request, $idCategorie, $idFiche)
    {
        $idFiche = $request->input('idFiche') ;
		
		//////////////////////////////////////SELON OWNERSHIP LADMIN
		$idMaitresseCreatrice = 1;
		
		if (!IsValidID($idCategorie) || !IsValidID($idFiche))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$result = DB::delete('
			DELETE FROM `fiche` 
			WHERE `idFiche` =? AND `idCategorie` =? AND `idMaitresseCreatrice` =? ', [$idFiche, $idCategorie, $idMaitresseCreatrice]);
		
		if ($result == 0) 
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function FicheGet(Request $request, $idCategorie, $idFiche)
    {
		//////////////////////////////////////SELON OWNERSHIP LADMIN
		$idMaitresseCreatrice = 1;
		
        if (!IsValidID($idCategorie) || !IsValidID($idFiche))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
         
        $fiche = new Fiche();
         
        $result = DB::select('
            SELECT * FROM `fiche`
            WHERE `idFiche`  ? AND `idCategorie` = ? AND
			(`estPublic` = 1 OR `idMaitresseCreatrice` =?)',
            [$idFiche ,$idCategorie, $idMaitresseCreatrice]);
         
        if ($result == null) 
        {
            return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
        }
         
        $fiche->idFiche = $result[0]->idFiche;
        $fiche->idCategorie = $result[0]->idCategorie;
        $fiche->titre = $result[0]->titre;
        $fiche->dateCreation = $result[0]->dateCreation;
        $fiche->idMaitresseCreatrice = $result[0]->idMaitresseCreatrice;
 
        $fiche->listeQuestion = DB::select('
            SELECT *
            FROM `question`
            WHERE `idFiche`=? AND
            `idCategorie`=?', [$idFiche ,$idCategorie]);
             
        return response()->json($fiche, 200);
    }
    
    public function FicheGetList(Request $request, $page = 1)
    {
        //////////////////////////////////////SELON LADMIN
		$idMaitresseCreatrice = 1;
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('
			SELECT * FROM `fiche` 
			WHERE `estPublic` = 1 OR `idMaitresseCreatrice` =? 
			LIMIT ?,30',[$idMaitresseCreatrice, ($page * 30) - 30]), 200);

    }
    
    public function UserCreation(Request $request)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////ASSOCIATION ELEVE avec ADMIN
		$idMaitresse = 1;
 
		$prenom = $request->input('prenom');
		$nom = $request->input('nom');
		$dateNaissance = $request->input('dateNaissance');
		$genre = $request->input('genre');
		$avatar = $request->input('avatar');

		if (!$request->has(['prenom', 'nom', 'dateNaissance', 'genre', 'avatar']))
			return response()->json(["code" => "400", "message" => "Missing Parameter"], 400);
		
		if (!$request->filled(['prenom', 'nom', 'dateNaissance', 'genre', 'avatar']))
			return response()->json(["code" => "400", "message" => "Unfilled Parameter"], 400);
		
		DB::insert('
			INSERT INTO `eleve` 
			(`prenom`, `nom`, `dateNaissance`, `genre`, `avatar`) 
			VALUES (?,?,?,?,?)', [$prenom, $nom, $dateNaissance, $genre, $avatar]);
		
		//////////////////////////////////////INSERT CLASSE ELEVE
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
	}
    
    public function UserDelete(Request $request, $idEleve)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////SELON LA CLASSE DE LADMIN
		$idMaitresse = 1;
		
		if (!IsValidID($idEleve))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$result = DB::delete('DELETE FROM `classe_eleve_maitresse` WHERE `idMaitresse` =? `idEleve` =?', [$idMaitresse, $idEleve]);
		
		if ($result == 0) 
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function UserGet(Request $request, $idEleve)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////SELON LA CLASSE DE LADMIN
		$idMaitresse = 1;
		
		if (!IsValidID($idEleve))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$result = DB::select('
			SELECT `eleve`.`idEleve`, `prenom`, `nom`, `dateNaissance`, `genre`, `avatar` 
			FROM `eleve` 
			JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `eleve`.`idEleve`
			WHERE `eleve`.`idEleve` =? AND `classe_eleve_maitresse`.`idMaitresse` =?',[$idEleve, $idMaitresse]);
		
		if ($result == null) 
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		
		return response()->json($result[0], 200); 
    }
    
    public function UserGetList(Request $request, $page = 1)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////SELON LA CLASSE DE LADMIN?????????????????????????????????
		$idMaitresse = 1;
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('
			SELECT `eleve`.`idEleve`, `classe_eleve_maitresse`.`idMaitresse`, `prenom`, `nom`, `genre`, `avatar`
			FROM `eleve` 
			JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `eleve`.`idEleve`
			LIMIT ?,30',[($page * 30) - 30]), 200); 
    }
    
    public function Historique(Request $request, $page = 1)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////SELON LA CLASSE DE LADMIN
		$idMaitresse = 1;
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('SELECT * FROM `historique` LIMIT ?,30',[($page * 30) - 30]), 200); 
    }
	
	protected function IsValidID($var)
    {
		if ($var <= 0 || $var > 2147483647 || $var == null)
			return false;

		return true; 
    }
}